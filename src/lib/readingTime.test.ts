import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getReadingTime } from './readingTime.ts';

/** One minute is exactly 200 words, so 200 words of noise shows up as a whole extra minute. */
const words = (count: number) => Array.from({ length: count }, () => 'word').join(' ');

test('counts prose at 200 words per minute', () => {
  assert.equal(getReadingTime(words(200)), 1);
  assert.equal(getReadingTime(words(201)), 2);
  assert.equal(getReadingTime(words(600)), 3);
});

test('never reports less than a minute', () => {
  assert.equal(getReadingTime(''), 1);
  assert.equal(getReadingTime('   '), 1);
  assert.equal(getReadingTime('short'), 1);
});

test('excludes fenced code blocks', () => {
  const body = `${words(200)}\n\n\`\`\`ts\n${words(600)}\n\`\`\`\n`;

  assert.equal(getReadingTime(body), 1);
});

test('excludes MDX import and export lines', () => {
  const imports = Array.from(
    { length: 50 },
    (_, i) => `import Thing${i} from '@components/content/Thing${i}.astro';`,
  ).join('\n');

  assert.equal(getReadingTime(`${imports}\n\n${words(200)}`), 1);
});

test('excludes JSX tags but keeps the prose they wrap', () => {
  const body = `<Figure src="/a.png" alt="a diagram of the pipeline" caption="one two three">\n${words(200)}\n</Figure>`;

  assert.equal(getReadingTime(body), 1);
});

test('does not count table pipes or separator rows as words', () => {
  const rows = Array.from({ length: 40 }, () => '| cell | cell | cell |').join('\n');
  const table = `| a | b | c |\n| --- | --- | --- |\n${rows}`;

  // 123 real words across the table; the pipes alone would add another 172.
  assert.equal(getReadingTime(`${table}\n\n${words(70)}`), 1);
});

test('does not count heading and list markers as words', () => {
  const list = Array.from({ length: 100 }, () => '- item').join('\n');

  assert.equal(getReadingTime(`## Section\n\n${list}\n\n${words(95)}`), 1);
});
