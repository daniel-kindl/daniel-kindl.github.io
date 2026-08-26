import assert from 'node:assert/strict';
import test from 'node:test';

import { buildChangelogEntry, bumpVersion, getReleaseType, parseCommit } from './release.mjs';

test('parses scoped and breaking conventional commits', () => {
  assert.deepEqual(parseCommit('feat(search)!: replace query model'), {
    type: 'feat',
    scope: 'search',
    subject: 'replace query model',
    breaking: true,
  });

  assert.equal(parseCommit('feat: change API\n\nBREAKING CHANGE: old clients are unsupported')?.breaking, true);
});

test('selects the highest release type', () => {
  assert.equal(
    getReleaseType([
      { message: 'fix: correct footer' },
      { message: 'feat: add search' },
      { message: 'chore: update dependencies' },
    ]),
    'minor',
  );

  assert.equal(getReleaseType([{ message: 'content: publish article' }]), null);
  assert.equal(getReleaseType([{ message: 'fix!: remove old route' }]), 'major');
});

test('bumps semantic versions', () => {
  assert.equal(bumpVersion('1.5.1', 'patch'), '1.5.2');
  assert.equal(bumpVersion('1.5.1', 'minor'), '1.6.0');
  assert.equal(bumpVersion('1.5.1', 'major'), '2.0.0');
});

test('keeps non-release commits in the next changelog', () => {
  const entry = buildChangelogEntry({
    version: '1.6.0',
    lastTag: 'v1.5.1',
    date: '2026-08-26',
    repositoryUrl: 'https://github.com/example/site',
    commits: [
      { sha: '1111111111111111', message: 'feat(search): add filters (#9)' },
      { sha: '2222222222222222', message: 'content: publish launch article' },
      { sha: '3333333333333333', message: 'chore: update dependencies' },
      { sha: '4444444444444444', message: 'refactor: rename helper' },
    ],
  });

  assert.match(entry, /### Features/);
  assert.match(entry, /\* \*\*search:\*\* add filters \(\[#9\]/);
  assert.match(entry, /### Content/);
  assert.match(entry, /### Chores & Dependencies/);
  assert.doesNotMatch(entry, /rename helper/);
});
