import assert from 'node:assert/strict';
import { test } from 'node:test';

import { blogPostingJsonLd, serializeJsonLd, type BlogPostingInput } from './jsonLd.ts';

const post: BlogPostingInput = {
  title: 'Why Logging Matters',
  description: 'A production fault leaves one record.',
  url: 'https://danielkindl.dev/writing/why-logging-matters/',
  image: 'https://danielkindl.dev/assets/meta/og-default.png',
  datePublished: new Date('2026-10-23T00:00:00Z'),
  keywords: ['Logging', 'Observability'],
  authorName: 'Daniel Kindl',
  authorUrl: 'https://danielkindl.dev/',
};

test('builds a BlogPosting with the fields that rich results read', () => {
  assert.deepEqual(blogPostingJsonLd(post), {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Why Logging Matters',
    description: 'A production fault leaves one record.',
    url: 'https://danielkindl.dev/writing/why-logging-matters/',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://danielkindl.dev/writing/why-logging-matters/',
    },
    image: 'https://danielkindl.dev/assets/meta/og-default.png',
    datePublished: '2026-10-23',
    keywords: 'Logging, Observability',
    author: { '@type': 'Person', name: 'Daniel Kindl', url: 'https://danielkindl.dev/' },
  });
});

test('adds dateModified only when the post was updated', () => {
  assert.equal('dateModified' in blogPostingJsonLd(post), false);
  const updated = blogPostingJsonLd({ ...post, dateModified: new Date('2026-11-02T00:00:00Z') });
  assert.equal(updated.dateModified, '2026-11-02');
});

test('omits keywords when the post has no tags', () => {
  assert.equal('keywords' in blogPostingJsonLd({ ...post, keywords: [] }), false);
});

test('uses the UTC calendar day, in any zone', () => {
  const zone = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    assert.equal(blogPostingJsonLd(post).datePublished, '2026-10-23');
  } finally {
    if (zone === undefined) delete process.env.TZ;
    else process.env.TZ = zone;
  }
});

test('serialized JSON parses back to the same data', () => {
  const data = blogPostingJsonLd(post);
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});

test('serialized JSON cannot close the script tag or start a comment', () => {
  const data = blogPostingJsonLd({ ...post, title: '</script><script>alert(1)</script> <!-- & x' });
  const text = serializeJsonLd(data);
  assert.ok(!text.includes('<'), 'text has a raw <');
  assert.ok(!text.includes('>'), 'text has a raw >');
  assert.equal(JSON.parse(text).headline, '</script><script>alert(1)</script> <!-- & x');
});

test('serialized JSON escapes the line and paragraph separators', () => {
  const text = serializeJsonLd({ a: 'x\u2028y\u2029z' });
  assert.ok(!text.includes('\u2028') && !text.includes('\u2029'));
  assert.equal(JSON.parse(text).a, 'x\u2028y\u2029z');
});
