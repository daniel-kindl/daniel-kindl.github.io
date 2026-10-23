// robots.txt in the production build in dist/. Run after `npm run build`.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { SITE_ORIGIN } from './site-checks.mjs';

const dist = join(import.meta.dirname, '..', 'dist');

/** The directive lines of a robots.txt file as `[name, value]`, without comments and blanks. */
function directives(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(':');
      return [line.slice(0, i).trim().toLowerCase(), line.slice(i + 1).trim()];
    });
}

const robots = () => directives(readFileSync(join(dist, 'robots.txt'), 'utf8'));

test('robots.txt has only standard directives', () => {
  const standard = new Set(['user-agent', 'allow', 'disallow', 'sitemap']);
  const other = robots()
    .map(([name]) => name)
    .filter((name) => !standard.has(name));
  assert.deepEqual(other, [], 'non-standard directives (for example Host)');
});

test('robots.txt allows all crawlers and names the sitemap', () => {
  const lines = robots();
  assert.deepEqual(
    lines.filter(([name]) => name === 'user-agent'),
    [['user-agent', '*']],
  );
  assert.deepEqual(
    lines.filter(([name]) => name === 'allow'),
    [['allow', '/']],
  );
});

test('the Sitemap line is an absolute URL of a file in the build', () => {
  const urls = robots()
    .filter(([name]) => name === 'sitemap')
    .map(([, value]) => value);
  assert.equal(urls.length, 1);
  const url = new URL(urls[0]);
  assert.equal(url.origin, SITE_ORIGIN);
  assert.ok(existsSync(join(dist, url.pathname)), `${url.pathname} is not in dist/`);
});

test('directives reads names and values, and ignores comments and blank lines', () => {
  const text =
    '# note\nUser-agent: *\n\nHost: https://x.test # c\r\nSitemap: https://x.test/s.xml\n';
  assert.deepEqual(directives(text), [
    ['user-agent', '*'],
    ['host', 'https://x.test'],
    ['sitemap', 'https://x.test/s.xml'],
  ]);
});
