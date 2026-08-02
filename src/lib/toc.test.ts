import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { MarkdownHeading } from 'astro';

import { getTocHeadings, hasToc } from './toc.ts';

const heading = (depth: number, text: string): MarkdownHeading => ({
  depth,
  text,
  slug: text.toLowerCase(),
});

test('keeps only h2 and h3', () => {
  const headings = [
    heading(1, 'Title'),
    heading(2, 'Section'),
    heading(3, 'Sub'),
    heading(4, 'Deep'),
  ];

  assert.deepEqual(
    getTocHeadings(headings).map((h) => h.text),
    ['Section', 'Sub'],
  );
});

test('preserves document order', () => {
  const headings = [heading(3, 'First'), heading(2, 'Second'), heading(3, 'Third')];

  assert.deepEqual(
    getTocHeadings(headings).map((h) => h.text),
    ['First', 'Second', 'Third'],
  );
});

test('suppresses a rail with fewer than two entries', () => {
  assert.equal(hasToc([]), false);
  assert.equal(hasToc([heading(2, 'Only')]), false);
  assert.equal(hasToc([heading(2, 'One'), heading(3, 'Two')]), true);
});
