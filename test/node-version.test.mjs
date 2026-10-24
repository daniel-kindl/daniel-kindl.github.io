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

/**
 * Problems with the actions/setup-node steps in one workflow file. An empty list means each
 * setup-node step sets `node-version` to exactly `major`.
 */
function setupNodeProblems(text, major) {
  return workflowMajors(text)
    .filter((found) => found !== major)
    .map((found) => `node-version ${found}`);
}

// The supported Node major (ADR #27). Change it here and in all the files that the tests below read.
const NODE_MAJOR = 26;
// The lowest 26.x that all non-optional dependencies accept: astro-eslint-parser 3.0.0 and
// eslint-plugin-astro 3.2.1 need >=26.3.0 on the 26 line.
const NODE_MIN = `${NODE_MAJOR}.3.0`;
const EXPECTED_RANGE = `>=${NODE_MIN} <${NODE_MAJOR + 1}`;

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

const SETUP = 'uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0';
const steps = (...lines) => `jobs:\n  build:\n    steps:\n${lines.join('\n')}\n`;
const setupStep = (...withLines) =>
  [
    '      - name: Setup Node.js',
    `        ${SETUP}`,
    ...(withLines.length ? ['        with:', ...withLines.map((l) => `          ${l}`)] : []),
  ].join('\n');

test('setup-node check accepts node-version equal to the major, plain or quoted', () => {
  const ok = steps(
    '      - uses: actions/checkout@3d3c42e # v7.0.1',
    setupStep('node-version: 26', 'cache: npm'),
    `      - ${SETUP}\n        with:\n          node-version: '26' # comment`,
    '      - run: npm ci',
  );
  assert.deepEqual(setupNodeProblems(ok, 26), []);
  assert.deepEqual(setupNodeProblems('jobs:\n  a:\n    steps:\n      - run: echo\n', 26), []);
});

test('setup-node check rejects weak or wrong Node settings', () => {
  const bad = {
    'node-version-file': setupStep('node-version-file: .nvmrc'),
    'lts alias': setupStep("node-version: 'lts/*'"),
    expression: setupStep('node-version: ${{ matrix.node }}'),
    latest: setupStep('node-version: latest'),
    'major.minor': setupStep('node-version: 26.0'),
    'full version': setupStep('node-version: 26.12.1'),
    'range form': setupStep('node-version: 26.x'),
    'other major': setupStep('node-version: 24'),
    'no with': setupStep(),
    'with but no node-version': setupStep('cache: npm'),
    'two node-version keys': setupStep('node-version: 26', 'node-version: 24'),
    'node-version outside a setup-node step': `${setupStep('node-version: 26')}\n      - uses: other/action@abc\n        with:\n          node-version: 26`,
  };
  const accepted = Object.entries(bad)
    .filter(([, step]) => setupNodeProblems(steps(step), 26).length === 0)
    .map(([name]) => name);
  assert.deepEqual(accepted, [], 'these bad forms must fail');
});

test('every actions/setup-node step in every workflow sets node-version to the major', () => {
  const dir = join(root, '.github', 'workflows');
  let setupSteps = 0;
  for (const file of readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))) {
    const text = readFileSync(join(dir, file), 'utf8');
    setupSteps += text.match(/uses:\s*actions\/setup-node@/g)?.length ?? 0;
    assert.deepEqual(setupNodeProblems(text, NODE_MAJOR), [], file);
  }
  assert.ok(setupSteps >= 1, 'no actions/setup-node step found in the workflows');
});
