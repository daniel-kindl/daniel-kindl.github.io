import assert from 'node:assert/strict';
import { after, test } from 'node:test';

import { formatDate } from './formatDate.ts';

const systemTimeZone = process.env.TZ;

after(() => {
  if (systemTimeZone === undefined) delete process.env.TZ;
  else process.env.TZ = systemTimeZone;
});

/**
 * Frontmatter dates parse as UTC midnight, so formatting them in the viewer's
 * zone renders the previous day for anyone west of Greenwich.
 */
test('renders the UTC calendar day west of Greenwich', () => {
  process.env.TZ = 'America/New_York';

  assert.equal(formatDate(new Date('2026-01-01T00:00:00Z')), 'January 1, 2026');
});

test('renders the same calendar day east of Greenwich', () => {
  process.env.TZ = 'Asia/Tokyo';

  assert.equal(formatDate(new Date('2026-01-01T00:00:00Z')), 'January 1, 2026');
});

test('formats as long-form US English', () => {
  process.env.TZ = 'UTC';

  assert.equal(formatDate(new Date('2026-07-18T00:00:00Z')), 'July 18, 2026');
});
