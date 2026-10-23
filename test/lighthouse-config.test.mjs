// Guards the Lighthouse CI settings. A noisy single run must not decide a pull request, and no
// threshold may get weaker. To make a threshold stricter, raise the value here as well.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const config = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'lighthouserc.json'), 'utf8'),
).ci;

const MIN_SCORES = {
  'categories:performance': 0.9,
  'categories:accessibility': 0.95,
  'categories:best-practices': 0.95,
  'categories:seo': 0.95,
};
const MAX_VALUES = {
  'largest-contentful-paint': 2500,
  'cumulative-layout-shift': 0.05,
  'resource-summary:font:size': 96000,
  'resource-summary:script:size': 30000,
};

test('each URL runs at least 3 times', () => {
  assert.ok(config.collect.numberOfRuns >= 3, `numberOfRuns is ${config.collect.numberOfRuns}`);
});

test('every assertion is an error and judges the median run, not the best run', () => {
  for (const [id, [level, options]] of Object.entries(config.assert.assertions)) {
    assert.equal(level, 'error', id);
    assert.equal(options.aggregationMethod, 'median-run', `${id}: aggregationMethod`);
  }
});

test('no score threshold is below its floor and none is missing', () => {
  for (const [id, floor] of Object.entries(MIN_SCORES)) {
    const options = config.assert.assertions[id]?.[1];
    assert.ok(options, `${id} is not asserted`);
    assert.ok(options.minScore >= floor, `${id}: minScore ${options.minScore} < ${floor}`);
  }
});

test('no limit is above its ceiling and none is missing', () => {
  for (const [id, ceiling] of Object.entries(MAX_VALUES)) {
    const options = config.assert.assertions[id]?.[1];
    assert.ok(options, `${id} is not asserted`);
    assert.ok(
      options.maxNumericValue <= ceiling,
      `${id}: maxNumericValue ${options.maxNumericValue} > ${ceiling}`,
    );
  }
});
