// The Node version must agree in package.json (engines), .nvmrc and every workflow.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = join(import.meta.dirname, '..');

/**
 * Parses a range of the form `>=24.0.0 <25` into its lowest and first excluded major version.
 * Any other form, and any range with no upper bound, returns null.
 */
function parseRange(range) {
  const match = /^>=(\d+)\.\d+\.\d+ <(\d+)(?:\.0\.0)?$/.exec(range.trim());
  return match ? { min: Number(match[1]), below: Number(match[2]) } : null;
}

function allows(range, major) {
  const parsed = parseRange(range);
  return parsed !== null && major >= parsed.min && major < parsed.below;
}

/** `node-version` values in workflow text, as major numbers. */
function workflowMajors(text) {
  return [...text.matchAll(/node-version:\s*['"]?(\d+)/g)].map((m) => Number(m[1]));
}

// The supported Node major (ADR #27). Change it here and in all the files that the tests below read.
const NODE_MAJOR = 26;
const EXPECTED_RANGE = `>=${NODE_MAJOR}.0.0 <${NODE_MAJOR + 1}`;

const range = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).engines.node;
const lockRange = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8')).packages['']
  .engines?.node;

test(`engines.node in package.json and package-lock.json is ${EXPECTED_RANGE}`, () => {
  assert.equal(range, EXPECTED_RANGE, 'package.json engines.node');
  assert.equal(lockRange, EXPECTED_RANGE, 'package-lock.json root engines.node');
});

test(`.nvmrc is ${NODE_MAJOR}`, () => {
  assert.equal(readFileSync(join(root, '.nvmrc'), 'utf8').trim(), String(NODE_MAJOR));
});

test('engines.node has a lower and an upper bound', () => {
  assert.ok(
    parseRange(range),
    `engines.node is "${range}", expected a range like "${EXPECTED_RANGE}"`,
  );
});

test('.nvmrc is inside the engines.node range', () => {
  const major = Number.parseInt(readFileSync(join(root, '.nvmrc'), 'utf8'), 10);
  assert.ok(allows(range, major), `.nvmrc ${major} is outside "${range}"`);
});

test('every workflow node-version is inside the engines.node range and is the supported major', () => {
  const dir = join(root, '.github', 'workflows');
  const found = readdirSync(dir)
    .filter((f) => /\.ya?ml$/.test(f))
    .flatMap((f) => workflowMajors(readFileSync(join(dir, f), 'utf8')).map((major) => [f, major]));
  assert.ok(found.length >= 1, 'no node-version found in the workflows');
  for (const [file, major] of found) {
    assert.ok(allows(range, major), `${file}: node-version ${major} is outside "${range}"`);
    assert.equal(major, NODE_MAJOR, `${file}: node-version ${major}, expected ${NODE_MAJOR}`);
  }
});

test('range checks accept a capped range and reject open or unknown ranges', () => {
  assert.ok(allows('>=24.0.0 <25', 24));
  assert.ok(allows('>=24.0.0 <25.0.0', 24));
  assert.equal(allows('>=24.0.0 <25', 25), false);
  assert.equal(allows('>=24.0.0 <25', 23), false);
  assert.equal(allows('>=24.0.0', 24), false, 'no upper bound');
  assert.equal(allows('^24.0.0', 24), false, 'unsupported form');
});

test('workflow majors read quoted and plain values', () => {
  const text = 'with:\n  node-version: 24\n  node-version: "25.1"\n  cache: npm\n';
  assert.deepEqual(workflowMajors(text), [24, 25]);
});
