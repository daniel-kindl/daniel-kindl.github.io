import assert from 'node:assert/strict';
import { test } from 'node:test';

import { slugify } from './slug.ts';

test('spells out characters that would otherwise be stripped', () => {
  assert.equal(slugify('C#'), 'csharp');
  assert.equal(slugify('C++'), 'cplusplus');
});

test('collapses runs of punctuation into a single separator', () => {
  assert.equal(slugify('CI/CD'), 'ci-cd');
  assert.equal(slugify('Spec — Traceability'), 'spec-traceability');
});

test('trims separators from both ends', () => {
  assert.equal(slugify('.NET'), 'net');
  assert.equal(slugify('  Hello World  '), 'hello-world');
});

test('is idempotent on an already-slugified value', () => {
  assert.equal(slugify('ci-cd'), 'ci-cd');
});
