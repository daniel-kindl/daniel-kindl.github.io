// Each self-hosted font must ship with its SIL OFL 1.1 text and the upstream copyright line.
// The OFL asks that the license and the copyright notice travel with every copy of the font.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const fontsDir = join(import.meta.dirname, '..', 'public', 'fonts');

// The first line of the upstream OFL file of each family, pinned with no change.
const UPSTREAM_COPYRIGHT = {
  'SpaceGrotesk-OFL.txt':
    'Copyright 2020 The Space Grotesk Project Authors (https://github.com/floriankarsten/space-grotesk)',
  'JetBrainsMono-OFL.txt':
    'Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono)',
  'KindlSans-OFL.txt': 'Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"',
};

// sha256 of the OFL 1.1 body in every upstream file, from the line `SIL OPEN FONT LICENSE` to the
// end, with CRLF changed to LF. The three upstream files have the same body.
const OFL_BODY_SHA256 = 'f19c674290e5dc79f02e8efe16139ab56a06a7128876f5b1579ffd0db5bc897e';

function oflBody(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => line.startsWith('SIL OPEN FONT LICENSE'));
  return start < 0 ? '' : lines.slice(start).join('\n');
}

const fontFiles = () => readdirSync(fontsDir).filter((file) => file.endsWith('.woff2'));

// `SpaceGrotesk-VariableFont_wght.woff2` -> `SpaceGrotesk-OFL.txt`
function licenseFileFor(fontFile) {
  return `${fontFile.replace(/\.woff2$/, '').split('-VariableFont')[0]}-OFL.txt`;
}

test('licenseFileFor maps a font file to the license file of its family', () => {
  assert.equal(licenseFileFor('SpaceGrotesk-VariableFont_wght.woff2'), 'SpaceGrotesk-OFL.txt');
  assert.equal(licenseFileFor('Foo-VariableFont_wdth,wght.woff2'), 'Foo-OFL.txt');
  assert.equal(licenseFileFor('Bar.woff2'), 'Bar-OFL.txt');
});

test('each font file has a license file with a copyright line and the OFL 1.1 text', () => {
  const fonts = fontFiles();
  assert.ok(fonts.length > 0, 'no .woff2 file in public/fonts');
  const problems = [];
  for (const font of fonts) {
    const license = licenseFileFor(font);
    const path = join(fontsDir, license);
    if (!existsSync(path)) {
      problems.push(`${font}: ${license} is missing`);
      continue;
    }
    const text = readFileSync(path, 'utf8');
    const [first] = text.split('\n');
    if (!/^Copyright\b/.test(first)) problems.push(`${license}: line 1 is not a copyright line`);
    if (text.includes('\r')) problems.push(`${license}: has CR line ends, use LF`);
    if (!text.includes('SIL OPEN FONT LICENSE Version 1.1')) {
      problems.push(`${license}: no OFL 1.1 title`);
    }
    if (!text.includes('PERMISSION & CONDITIONS')) {
      problems.push(`${license}: no PERMISSION & CONDITIONS section`);
    }
  }
  assert.deepEqual(problems, []);
});

test('each license file starts with the pinned upstream copyright line', () => {
  const licenses = new Set(fontFiles().map(licenseFileFor));
  for (const license of licenses) {
    assert.ok(license in UPSTREAM_COPYRIGHT, `${license} has no pinned upstream copyright line`);
    const path = join(fontsDir, license);
    assert.ok(existsSync(path), `${license} is missing`);
    const [first] = readFileSync(path, 'utf8').split('\n');
    assert.equal(first, UPSTREAM_COPYRIGHT[license], `${license}: line 1`);
  }
});

test('oflBody returns the text from the title line to the end, with LF line ends', () => {
  const text = 'Copyright\r\n\r\n---\r\nSIL OPEN FONT LICENSE V\r\nbody\r\n';
  assert.equal(oflBody(text), 'SIL OPEN FONT LICENSE V\nbody\n');
  assert.equal(oflBody('no title here'), '');
});

test('the OFL body of each license file is the same as the pinned upstream text', () => {
  for (const license of new Set(fontFiles().map(licenseFileFor))) {
    const body = oflBody(readFileSync(join(fontsDir, license), 'utf8'));
    const hash = createHash('sha256').update(body).digest('hex');
    assert.equal(hash, OFL_BODY_SHA256, `${license}: the OFL body text changed`);
  }
});
