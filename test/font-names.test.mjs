// OFL 1.1 clause 3: a Modified Version must not use a Reserved Font Name as its primary font name.
// The body font is a subset of IBM Plex Sans (Reserved Font Name "Plex"), so it ships as
// Kindl Sans. These tests check the font name table, the CSS, the preload links, the file names
// and the built site.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { familyName, readNameRecords } from './woff2.mjs';

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
