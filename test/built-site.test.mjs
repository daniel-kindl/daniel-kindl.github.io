// Sanity checks on the production build in dist/. Run after `npm run build`.
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  SITE_ORIGIN,
  draftIds,
  findBrokenLinks,
  listHtmlFiles,
  resolvePath,
  xmlTagValues,
} from './site-checks.mjs';

const dist = join(import.meta.dirname, '..', 'dist');
const writingDir = join(import.meta.dirname, '..', 'src', 'content', 'writing');

test('dist exists (run npm run build first)', () => {
  assert.ok(existsSync(join(dist, 'index.html')), 'dist/index.html is missing');
});

// Known, harmless: the 404 page's canonical URL is /404/, which GitHub Pages serves from
// 404.html, not a directory. Tracked as a follow-up; keep this list narrow.
const KNOWN_BROKEN = new Set([`404.html: ${SITE_ORIGIN}/404/ (missing target)`]);

test('internal links and anchors resolve', () => {
  const broken = [];
  for (const rel of listHtmlFiles(dist)) {
    broken.push(...findBrokenLinks(dist, rel, readFileSync(join(dist, rel), 'utf8')));
  }
  assert.deepEqual(
    broken.filter((b) => !KNOWN_BROKEN.has(b)),
    [],
  );
});

test('RSS feed is well formed and every item points at a built page', () => {
  const xml = readFileSync(join(dist, 'rss.xml'), 'utf8');
  assert.match(xml, /^<\?xml[^>]*\?><rss version="2\.0">/);
  assert.match(xml, /<\/channel><\/rss>\s*$/);
  const links = xmlTagValues(xml, 'link').filter((l) => l.includes('/writing/'));
  assert.ok(links.length > 0, 'RSS has no writing items');
  for (const link of links) {
    assert.ok(link.startsWith(SITE_ORIGIN), `${link} is not on ${SITE_ORIGIN}`);
    assert.ok(resolvePath(dist, link.slice(SITE_ORIGIN.length)), `${link} has no built page`);
  }
});

test('sitemap is well formed and every URL is a built page', () => {
  const index = readFileSync(join(dist, 'sitemap-index.xml'), 'utf8');
  const maps = xmlTagValues(index, 'loc');
  assert.ok(maps.length > 0, 'sitemap index is empty');
  for (const map of maps) {
    const xml = readFileSync(join(dist, map.slice(SITE_ORIGIN.length)), 'utf8');
    assert.match(xml, /^<\?xml[^>]*\?><urlset /);
    for (const loc of xmlTagValues(xml, 'loc')) {
      assert.ok(loc.startsWith(SITE_ORIGIN), `${loc} is not on ${SITE_ORIGIN}`);
      assert.ok(resolvePath(dist, loc.slice(SITE_ORIGIN.length)), `${loc} has no built page`);
    }
  }
});

test('draft posts are not in the production build, RSS, or sitemap', () => {
  const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');
  const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  for (const id of draftIds(writingDir)) {
    assert.ok(!existsSync(join(dist, 'writing', id)), `draft ${id} was built`);
    assert.ok(!rss.includes(`/writing/${id}/`), `draft ${id} is in RSS`);
    assert.ok(!sitemap.includes(`/writing/${id}/`), `draft ${id} is in the sitemap`);
  }
});

// Fixture tests: prove the checkers fail on known-bad input.
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'site-'));
  mkdirSync(join(dir, 'a'));
  writeFileSync(join(dir, 'a', 'index.html'), '<h2 id="ok">x</h2>');
  writeFileSync(join(dir, 'index.html'), '');
  const posts = join(dir, 'posts');
  mkdirSync(posts);
  writeFileSync(join(posts, 'live.mdx'), '---\ntitle: x\ndraft: false\n---\n');
  writeFileSync(join(posts, 'wip.mdx'), '---\ntitle: x\ndraft: true\n---\n');
  return { dir, posts };
}

test('checker reports a missing page and a missing anchor', () => {
  const { dir } = fixture();
  const html =
    '<a href="/a/"></a><a href="/a/#ok"></a><a href="/gone/"></a><a href="/a/#nope"></a>' +
    `<a href="${SITE_ORIGIN}/gone2"></a><a href="https://example.com/x"></a><a href="mailto:a@b"></a>`;
  assert.deepEqual(findBrokenLinks(dir, 'index.html', html), [
    'index.html: /gone/ (missing target)',
    'index.html: /a/#nope (missing anchor)',
    `index.html: ${SITE_ORIGIN}/gone2 (missing target)`,
  ]);
});

test('draft detection finds only draft: true entries', () => {
  const { posts } = fixture();
  assert.deepEqual(draftIds(posts), ['wip']);
});
