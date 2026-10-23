// OFL 1.1 clause 3: a Modified Version must not use a Reserved Font Name as its primary font name.
// The body font is a subset of IBM Plex Sans (Reserved Font Name "Plex"), so it ships as
// Kindl Sans. These tests check the font name table, the CSS, the preload links, the file names
// and the built site.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { tmpdir } from 'node:os';
import { brotliCompressSync } from 'node:zlib';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { familyName, readBase128, readNameRecords } from './woff2.mjs';

const root = join(import.meta.dirname, '..');
const fontsDir = join(root, 'public', 'fonts');
const dist = join(root, 'dist');
const read = (file) => readFileSync(join(root, file), 'utf8');

const RESERVED = /plex/i;
const BODY_FAMILY = 'Kindl Sans';
const BODY_FILE = 'KindlSans-VariableFont_wght.woff2';
// Name IDs that may name IBM: copyright, trademark, manufacturer, designer, license, license URL.
const NOTICE_IDS = new Set([0, 7, 8, 9, 13, 14]);

const fontFiles = () => readdirSync(fontsDir).filter((file) => file.endsWith('.woff2'));

// Returns each @font-face block as { family, url }. Works on source CSS and on minified CSS.
function fontFaces(css) {
  return [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => ({
    family: body.match(/font-family:\s*["']?([^;"']+)["']?/)?.[1].trim(),
    url: body.match(/url\(\s*["']?([^"')]+)["']?\s*\)/)?.[1],
  }));
}

const preloadHrefs = (html) =>
  [...html.matchAll(/<link\b[^>]*\brel="preload"[^>]*>/g)]
    .map(([tag]) => tag.match(/\bhref="([^"]+)"/)?.[1])
    .filter((href) => href?.startsWith('/fonts/'));

test('no file in public/fonts has the reserved name in its file name', () => {
  const files = readdirSync(fontsDir).filter((file) => RESERVED.test(file));
  assert.deepEqual(files, []);
});

test('the body font name table uses Kindl Sans and no record uses the reserved name', () => {
  const records = readNameRecords(join(fontsDir, BODY_FILE));
  assert.equal(familyName(join(fontsDir, BODY_FILE)), BODY_FAMILY);
  const reserved = records.filter((r) => RESERVED.test(r.text));
  assert.deepEqual(reserved, [], 'a name record uses the reserved name');
  const branded = records.filter((r) => !NOTICE_IDS.has(r.nameID) && /\bIBM/.test(r.text));
  assert.deepEqual(branded, [], 'a font name record names IBM');
});

// OFL FAQ 3.1: do not remove the copyright statement from a font file. Name ID 0 is that record.
const IBM_COPYRIGHT = 'Copyright 2019 IBM Corp.';
const hasIbmCopyright = (records) =>
  records.some((r) => r.nameID === 0 && r.platformID === 3 && r.text.includes(IBM_COPYRIGHT));

test('hasIbmCopyright needs name ID 0 with the IBM copyright text', () => {
  const ibm = { nameID: 0, platformID: 3, text: `${IBM_COPYRIGHT} All rights reserved.` };
  assert.equal(hasIbmCopyright([ibm]), true);
  assert.equal(hasIbmCopyright([]), false, 'name ID 0 removed');
  assert.equal(hasIbmCopyright([{ ...ibm, text: 'Copyright 2026 Kindl' }]), false);
  assert.equal(hasIbmCopyright([{ ...ibm, nameID: 7 }]), false, 'text in another record');
});

test('the body font keeps the IBM copyright record (name ID 0)', () => {
  assert.ok(hasIbmCopyright(readNameRecords(join(fontsDir, BODY_FILE))));
});

test('every font file in public/fonts has no reserved name in its name table', () => {
  for (const file of fontFiles()) {
    const reserved = readNameRecords(join(fontsDir, file)).filter((r) => RESERVED.test(r.text));
    assert.deepEqual(reserved, [], `${file} uses the reserved name`);
  }
});

test('global.css does not use the reserved name and sets Kindl Sans as the sans font', () => {
  const css = read('src/styles/global.css');
  assert.doesNotMatch(css, RESERVED);
  assert.match(css, new RegExp(`--font-sans:\\s*'${BODY_FAMILY}',`));
});

test('each @font-face loads a file in public/fonts whose name table has the same family', () => {
  const faces = fontFaces(read('src/styles/global.css'));
  assert.ok(
    faces.some((face) => face.family === BODY_FAMILY),
    `no @font-face for ${BODY_FAMILY}`,
  );
  for (const { family, url } of faces) {
    assert.ok(url?.startsWith('/fonts/'), `${family}: src is not in /fonts/`);
    const path = join(root, 'public', url);
    assert.ok(existsSync(path), `${family}: ${url} does not exist`);
    assert.equal(familyName(path), family, `${url}: name table family`);
  }
});

test('the preload links point at existing font files with no reserved name', () => {
  const hrefs = preloadHrefs(read('src/layouts/Layout.astro'));
  assert.ok(hrefs.includes(`/fonts/${BODY_FILE}`), `no preload link for ${BODY_FILE}`);
  for (const href of hrefs) {
    assert.doesNotMatch(href, RESERVED);
    assert.ok(existsSync(join(root, 'public', href)), `${href} does not exist`);
  }
});

test('LICENSE-CONTENT.md credits IBM Plex Sans as the source of Kindl Sans under the OFL', () => {
  const text = read('LICENSE-CONTENT.md').replace(/\s+/g, ' ');
  assert.ok(text.includes('Kindl Sans is a Modified Version of IBM Plex Sans'), 'no credit line');
  assert.ok(text.includes('public/fonts/KindlSans-README.txt'), 'it must point at the steps');
  assert.ok(text.includes('KindlSans-OFL.txt'), 'it must point at the license file');
});

test('the built site ships Kindl Sans: CSS, preload and font file in dist', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.ok(preloadHrefs(html).includes(`/fonts/${BODY_FILE}`), 'no preload in dist/index.html');
  assert.doesNotMatch(html, RESERVED);
  const cssFiles = readdirSync(join(dist, '_astro')).filter((file) => file.endsWith('.css'));
  const css = cssFiles.map((file) => readFileSync(join(dist, '_astro', file), 'utf8')).join('\n');
  const face = fontFaces(css).find(({ family }) => family === BODY_FAMILY);
  assert.ok(face, `no @font-face for ${BODY_FAMILY} in the built CSS`);
  assert.equal(face.url, `/fonts/${BODY_FILE}`);
  assert.ok(existsSync(join(dist, 'fonts', BODY_FILE)), `dist/fonts/${BODY_FILE} is missing`);
  assert.equal(familyName(join(dist, 'fonts', BODY_FILE)), BODY_FAMILY);
});

test('the colophon font list names the families of the font files, not the old family', () => {
  const source = read('src/pages/colophon.astro');
  const list = source.match(/const fonts = \[([^\]]*)\]/)?.[1];
  assert.ok(list, 'no `const fonts = [...]` line in colophon.astro');
  const names = [...list.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(
    names.toSorted(),
    fontFiles()
      .map((file) => familyName(join(fontsDir, file)))
      .toSorted(),
  );
  assert.doesNotMatch(list, RESERVED);
});

test('readBase128 rejects a leading zero byte (WOFF2 spec section 5.1)', () => {
  assert.equal(readBase128(Buffer.from([0x05]), { at: 0 }), 5);
  assert.throws(() => readBase128(Buffer.from([0x80, 0x05]), { at: 0 }), /leading zero/);
});

test('the WOFF2 reader stops a Brotli stream that expands past the size limit', () => {
  // One `name` table entry, with a tiny Brotli stream that expands to 64 MiB of zeros.
  const stream = brotliCompressSync(Buffer.alloc(64 * 1024 * 1024));
  const header = Buffer.alloc(48);
  header.write('wOF2', 0, 'latin1');
  header.writeUInt16BE(1, 12); // numTables
  header.writeUInt32BE(stream.length, 20); // totalCompressedSize
  const entry = Buffer.from([5, 0xa0, 0x80, 0x80, 0x00]); // `name`, no transform, 64 MiB
  const dir = mkdtempSync(join(tmpdir(), 'woff2-'));
  const file = join(dir, 'bomb.woff2');
  writeFileSync(file, Buffer.concat([header, entry, stream]));
  assert.throws(() => readNameRecords(file), /larger than|limit|Cannot create a Buffer/i);
});
