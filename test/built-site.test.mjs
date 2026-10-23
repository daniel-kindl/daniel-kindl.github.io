// Sanity checks on the production build in dist/. Run after `npm run build`.
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  SITE_ORIGIN,
  draftIds,
  expectedCanonical,
  findBrokenLinks,
  findFigureImageProblems,
  findHeadMetadataProblems,
  hasNoindex,
  listHtmlFiles,
  resolvePath,
  xmlTagValues,
} from './site-checks.mjs';

const dist = join(import.meta.dirname, '..', 'dist');
const writingDir = join(import.meta.dirname, '..', 'src', 'content', 'writing');

test('dist exists (run npm run build first)', () => {
  assert.ok(existsSync(join(dist, 'index.html')), 'dist/index.html is missing');
});

test('internal links and anchors resolve', () => {
  const broken = [];
  for (const rel of listHtmlFiles(dist)) {
    broken.push(...findBrokenLinks(dist, rel, readFileSync(join(dist, rel), 'utf8')));
  }
  assert.deepEqual(broken, []);
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

test('every figure image has alt text and is not aria-hidden', () => {
  const problems = [];
  for (const rel of listHtmlFiles(dist)) {
    problems.push(...findFigureImageProblems(rel, readFileSync(join(dist, rel), 'utf8')));
  }
  assert.deepEqual(problems, []);
});

test('every built page has a title, a description, one canonical URL, and one h1', () => {
  const problems = [];
  for (const rel of listHtmlFiles(dist)) {
    problems.push(...findHeadMetadataProblems(rel, readFileSync(join(dist, rel), 'utf8')));
  }
  assert.deepEqual(problems, []);
});

test('only the 404 page is noindex', () => {
  const noindex = listHtmlFiles(dist).filter((rel) =>
    hasNoindex(readFileSync(join(dist, rel), 'utf8')),
  );
  assert.deepEqual(noindex, ['404.html']);
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

test('figure image check reports an empty alt, a missing alt, and aria-hidden', () => {
  const html =
    '<figure><img src="a.svg" alt="A diagram"><img src="b.svg" alt="" aria-hidden="true">' +
    '<img src="c.svg" alt="  "><img src="d.svg"><figcaption>x</figcaption></figure>' +
    '<img src="outside.svg"><figure><img src="e.svg" alt="ok"></figure>';
  assert.deepEqual(findFigureImageProblems('p.html', html), [
    'p.html: figure image has no alt text',
    'p.html: figure image is aria-hidden',
    'p.html: figure image has no alt text',
    'p.html: figure image has no alt text',
  ]);
});

test('expected canonical URL follows the file path', () => {
  assert.equal(expectedCanonical('index.html'), `${SITE_ORIGIN}/`);
  assert.equal(expectedCanonical('about/index.html'), `${SITE_ORIGIN}/about/`);
  assert.equal(
    expectedCanonical('writing/tags/net/index.html'),
    `${SITE_ORIGIN}/writing/tags/net/`,
  );
  assert.equal(expectedCanonical('404.html'), `${SITE_ORIGIN}/404.html`);
});

function head({
  title = '<title>A page</title>',
  description = '<meta name="description" content="About the page">',
  canonical = `<link rel="canonical" href="${SITE_ORIGIN}/a/">`,
  body = '<h1>A page</h1>',
} = {}) {
  return `<!doctype html><html><head>${title}${description}${canonical}</head><body>${body}</body></html>`;
}

test('head check accepts a complete page', () => {
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head()), []);
});

test('head check reports a missing or empty title and description', () => {
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head({ title: '' })), [
    'a/index.html: expected one <title>, found 0',
  ]);
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head({ title: '<title> </title>' })), [
    'a/index.html: <title> is empty',
  ]);
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head({ description: '' })), [
    'a/index.html: expected one meta description, found 0',
  ]);
  assert.deepEqual(
    findHeadMetadataProblems(
      'a/index.html',
      head({ description: '<meta name="description" content="">' }),
    ),
    ['a/index.html: meta description is empty'],
  );
});

test('head check reports a missing, wrong, or repeated canonical', () => {
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head({ canonical: '' })), [
    'a/index.html: expected one canonical link, found 0',
  ]);
  assert.deepEqual(
    findHeadMetadataProblems(
      'a/index.html',
      head({ canonical: `<link rel="canonical" href="${SITE_ORIGIN}/b/">` }),
    ),
    [`a/index.html: canonical is ${SITE_ORIGIN}/b/, expected ${SITE_ORIGIN}/a/`],
  );
  const twice = `<link rel="canonical" href="${SITE_ORIGIN}/a/"><link rel="canonical" href="${SITE_ORIGIN}/a/">`;
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head({ canonical: twice })), [
    'a/index.html: expected one canonical link, found 2',
  ]);
});

test('head check reports a page with no h1 or two h1 elements', () => {
  assert.deepEqual(findHeadMetadataProblems('a/index.html', head({ body: '<h2>x</h2>' })), [
    'a/index.html: expected one <h1>, found 0',
  ]);
  assert.deepEqual(
    findHeadMetadataProblems('a/index.html', head({ body: '<h1>a</h1><h1 class="x">b</h1>' })),
    ['a/index.html: expected one <h1>, found 2'],
  );
  // Escaped markup in a code block is text, not a heading.
  assert.deepEqual(
    findHeadMetadataProblems('a/index.html', head({ body: '<h1>a</h1><pre>&lt;h1&gt;</pre>' })),
    [],
  );
});

test('noindex check reads the robots meta tag only', () => {
  assert.equal(hasNoindex(head()), false);
  assert.equal(hasNoindex('<meta name="robots" content="noindex, follow">'), true);
  assert.equal(hasNoindex('<meta content="noindex" name="robots">'), true);
  assert.equal(hasNoindex('<meta name="robots" content="index, follow">'), false);
  assert.equal(hasNoindex('<p>noindex</p><meta name="description" content="noindex">'), false);
});
