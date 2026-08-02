import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getYearsOfExperience } from './experience.ts';

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

test('counts only whole elapsed years', () => {
  const justUnderTwo = new Date(Date.now() - MS_PER_YEAR * 2 + 60_000);
  const justOverTwo = new Date(Date.now() - MS_PER_YEAR * 2 - 60_000);

  assert.equal(getYearsOfExperience(justUnderTwo), 1);
  assert.equal(getYearsOfExperience(justOverTwo), 2);
});

test('reports zero before the first year completes', () => {
  assert.equal(getYearsOfExperience(new Date(Date.now() - 60_000)), 0);
});
