// Social and structured metadata on the production build in dist/. Run after `npm run build`.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { SITE_ORIGIN, listHtmlFiles } from './site-checks.mjs';

const dist = join(import.meta.dirname, '..', 'dist');
const writingDir = join(import.meta.dirname, '..', 'src', 'content', 'writing');

function decode(text) {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

/** Attributes of every <meta> tag in the page, with values decoded. */
function metaTags(html) {
  return [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => {
    const attrs = {};
    for (const a of m[0].matchAll(/\s([a-zA-Z:-]+)="([^"]*)"/g)) attrs[a[1]] = decode(a[2]);
    return attrs;
  });
}

/** Content of the meta tags that use `attr` (`property` or `name`) equal to `key`. */
function metaContent(html, attr, key) {
  return metaTags(html)
    .filter((t) => t[attr] === key)
    .map((t) => t.content);
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => m[1],
  );
}

/** Published posts with the front matter fields the checks need. */
function publishedPosts() {
  return readdirSync(writingDir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const fm = readFileSync(join(writingDir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1];
      const field = (name) => fm.match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'm'))?.[1];
      const text = (name) =>
        field(name)
          ?.replace(/^'(.*)'$/s, '$1')
          .replaceAll("''", "'");
      return {
        id: f.replace(/\.mdx?$/, ''),
        draft: field('draft') === 'true',
        title: text('title'),
        summary: text('summary'),
        date: field('date'),
        updated: field('updated'),
        tags: [...(field('tags')?.matchAll(/'([^']*)'/g) ?? [])].map((m) => m[1]),
      };
    })
    .filter((p) => !p.draft);
}

const posts = publishedPosts();
const postFiles = new Set(posts.map((p) => `writing/${p.id}/index.html`));
const read = (rel) => readFileSync(join(dist, rel), 'utf8');

test('the checks find published posts in the build', () => {
  assert.ok(posts.length > 0, 'no published posts');
  for (const rel of postFiles) assert.ok(listHtmlFiles(dist).includes(rel), `${rel} is missing`);
});

test('every post has og:type article and the published time', () => {
  for (const post of posts) {
    const html = read(`writing/${post.id}/index.html`);
    assert.deepEqual(metaContent(html, 'property', 'og:type'), ['article'], post.id);
    assert.deepEqual(metaContent(html, 'property', 'article:published_time'), [post.date], post.id);
  }
});

test('every post has one BlogPosting JSON-LD block that matches the post', () => {
  for (const post of posts) {
    const html = read(`writing/${post.id}/index.html`);
    const blocks = jsonLdBlocks(html);
    assert.equal(blocks.length, 1, `${post.id}: expected one JSON-LD block`);
    const data = JSON.parse(blocks[0]);
    const url = `${SITE_ORIGIN}/writing/${post.id}/`;
    assert.equal(data['@context'], 'https://schema.org', post.id);
    assert.equal(data['@type'], 'BlogPosting', post.id);
    assert.equal(data.headline, post.title, post.id);
    assert.equal(data.description, post.summary, post.id);
    assert.equal(data.datePublished, post.date, post.id);
    assert.equal(data.dateModified, post.updated, post.id);
    assert.equal(data.url, url, post.id);
    assert.equal(data.mainEntityOfPage['@id'], url, post.id);
    assert.deepEqual(metaContent(html, 'property', 'og:url'), [url], post.id);
    assert.equal(data.image, `${SITE_ORIGIN}/assets/meta/og-default.png`, post.id);
    assert.equal(data.keywords, post.tags.length ? post.tags.join(', ') : undefined, post.id);
    assert.equal(data.author['@type'], 'Person', post.id);
    assert.equal(data.author.name, 'Daniel Kindl', post.id);
  }
});

test('pages that are not posts keep og:type website and have no article data', () => {
  const others = listHtmlFiles(dist).filter((rel) => !postFiles.has(rel));
  assert.ok(others.length > 0);
  for (const rel of others) {
    const html = read(rel);
    assert.deepEqual(metaContent(html, 'property', 'og:type'), ['website'], rel);
    assert.deepEqual(metaContent(html, 'property', 'article:published_time'), [], rel);
    assert.deepEqual(jsonLdBlocks(html), [], rel);
  }
});

test('every page has the five Twitter card tags with name= and none with property=', () => {
  const keys = ['card', 'url', 'title', 'description', 'image'].map((k) => `twitter:${k}`);
  for (const rel of listHtmlFiles(dist)) {
    const tags = metaTags(read(rel));
    for (const key of keys) {
      assert.equal(tags.filter((t) => t.name === key).length, 1, `${rel}: name="${key}"`);
    }
    const wrong = tags.filter((t) => t.property?.startsWith('twitter:')).map((t) => t.property);
    assert.deepEqual(wrong, [], `${rel}: twitter tags with property=`);
  }
});

test('Twitter card values match the Open Graph values', () => {
  for (const rel of listHtmlFiles(dist)) {
    const html = read(rel);
    for (const key of ['url', 'title', 'description', 'image']) {
      assert.deepEqual(
        metaContent(html, 'name', `twitter:${key}`),
        metaContent(html, 'property', `og:${key}`),
        `${rel}: twitter:${key}`,
      );
    }
    assert.deepEqual(metaContent(html, 'name', 'twitter:card'), ['summary_large_image'], rel);
  }
});
