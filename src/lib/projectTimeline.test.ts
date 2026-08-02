import assert from 'node:assert/strict';
import { after, test } from 'node:test';

import { getProjectTimelineLabel } from './projectTimeline.ts';

const systemTimeZone = process.env.TZ;

after(() => {
  if (systemTimeZone === undefined) delete process.env.TZ;
  else process.env.TZ = systemTimeZone;
});

test('reads the year in UTC west of Greenwich', () => {
  process.env.TZ = 'America/New_York';

  assert.equal(
    getProjectTimelineLabel({ start: new Date('2026-01-01T00:00:00Z'), end: null }),
    '2026–Present',
  );
});

test('collapses a range that starts and ends in one year', () => {
  process.env.TZ = 'UTC';

  assert.equal(
    getProjectTimelineLabel({
      start: new Date('2025-02-01T00:00:00Z'),
      end: new Date('2025-11-01T00:00:00Z'),
    }),
    '2025',
  );
});

test('renders a multi-year range', () => {
  process.env.TZ = 'UTC';

  assert.equal(
    getProjectTimelineLabel({
      start: new Date('2024-06-01T00:00:00Z'),
      end: new Date('2026-01-01T00:00:00Z'),
    }),
    '2024–2026',
  );
});
