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

const indentOf = (line) => line.length - line.trimStart().length;

/** The value of a YAML scalar with its quotes and its trailing comment removed. */
function scalar(value) {
  const text = value.replace(/\s+#.*$/, '').trim();
  const quoted = /^(['"])(.*)\1$/.exec(text);
  return quoted ? quoted[2] : text;
}

/** The indent of the key on a line, after a leading `- ` if there is one. */
const keyIndent = (line) => indentOf(line) + (/^\s*(-\s+)?/.exec(line)[1]?.length ?? 0);

/** A `uses:` line for actions/setup-node. The value can be quoted, and the case can differ. */
const SETUP_NODE_USES = /^\s*(?:-\s+)?uses:\s*['"]?actions\/setup-node@/i;

/**
 * Problems with the actions/setup-node steps in one workflow file. An empty list means each
 * setup-node step sets `node-version` to exactly `major` (no file, alias, expression, range or
 * minor version) directly under the `with:` line of the step, and no `node-version` key is in
 * another place.
 */
function setupNodeProblems(text, major) {
  const lines = text.split('\n');
  const problems = [];
  const inSetupStep = new Set();
  lines.forEach((line, i) => {
    if (!SETUP_NODE_USES.test(line)) return;
    // The step starts at the nearest `- ` line at a lower indent (or at this line).
    let start = i;
    while (start >= 0 && !/^\s*-\s/.test(lines[start])) start--;
    const dash = indentOf(lines[start]);
    const stepKeys = keyIndent(lines[start]);
    let end = start + 1;
    while (end < lines.length && (lines[end].trim() === '' || indentOf(lines[end]) > dash)) end++;
    const versions = [];
    for (let j = start; j < end; j++) {
      inSetupStep.add(j);
      const key = /^\s*(?:-\s+)?(node-version(?:-file)?):\s*(.*)$/.exec(lines[j]);
      if (!key) continue;
      // The parent is the nearest line above with a lower key indent (not blank, not a comment).
      let parent = j - 1;
      while (
        parent >= start &&
        (/^\s*(#|$)/.test(lines[parent]) || keyIndent(lines[parent]) >= keyIndent(lines[j]))
      ) {
        parent--;
      }
      const underWith =
        parent >= start &&
        keyIndent(lines[parent]) === stepKeys &&
        /^\s*(?:-\s+)?with:\s*(#.*)?$/.test(lines[parent]);
      if (key[1] === 'node-version-file') problems.push(`line ${j + 1}: node-version-file`);
      else if (!underWith) problems.push(`line ${j + 1}: node-version is not under with`);
      else versions.push([j, scalar(key[2])]);
    }
    if (versions.length !== 1) {
      problems.push(
        `line ${i + 1}: setup-node has ${versions.length} node-version keys under with`,
      );
    }
    for (const [j, value] of versions) {
      if (value !== String(major)) problems.push(`line ${j + 1}: node-version "${value}"`);
    }
  });
  lines.forEach((line, i) => {
    if (/^\s*(?:-\s+)?node-version(?:-file)?:/.test(line) && !inSetupStep.has(i)) {
      problems.push(`line ${i + 1}: node-version outside a setup-node step`);
    }
  });
  return problems;
}

// The supported Node major (ADR #27). Change it here and in all the files that the tests below
// read.
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

test('range checks accept a capped range and reject open or unknown ranges', () => {
  assert.ok(allows('>=24.0.0 <25', 24));
  assert.ok(allows('>=24.0.0 <25.0.0', 24));
  assert.equal(allows('>=24.0.0 <25', 25), false);
  assert.equal(allows('>=24.0.0 <25', 23), false);
  assert.equal(allows('>=24.0.0', 24), false, 'no upper bound');
  assert.equal(allows('^24.0.0', 24), false, 'unsupported form');
});

const SETUP = 'uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0';
const steps = (...lines) => `jobs:\n  build:\n    steps:\n${lines.join('\n')}\n`;
const PIN = '949feb2413d6458794dcd2491c4babbbce0c15c1';
// A setup-node step with the given `uses:` line and, if there are lines, a `with:` block.
const stepWith = (uses, ...withLines) =>
  [
    '      - name: Setup Node.js',
    `        ${uses}`,
    ...(withLines.length ? ['        with:', ...withLines.map((l) => `          ${l}`)] : []),
  ].join('\n');
const setupStep = (...withLines) => stepWith(SETUP, ...withLines);

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
    'node-version outside a setup-node step': [
      setupStep('node-version: 26'),
      '      - uses: other/action@abc',
      '        with:',
      '          node-version: 26',
    ].join('\n'),
  };
  const accepted = Object.entries(bad)
    .filter(([, step]) => setupNodeProblems(steps(step), 26).length === 0)
    .map(([name]) => name);
  assert.deepEqual(accepted, [], 'these bad forms must fail');
});

test('setup-node check finds a quoted or other-case uses value', () => {
  const forms = [
    `uses: "actions/setup-node@${PIN}"`,
    `uses: 'actions/setup-node@${PIN}'`,
    `uses: Actions/Setup-Node@${PIN}`,
  ];
  for (const uses of forms) {
    assert.deepEqual(setupNodeProblems(steps(stepWith(uses, 'node-version: 26')), 26), [], uses);
  }
});

test('setup-node check rejects a version under env and a step it cannot find', () => {
  const bad = {
    'node-version under env, no with': `${setupStep()}\n        env:\n          node-version: 26`,
    'double-quoted uses, no node-version': stepWith(`uses: "actions/setup-node@${PIN}"`),
    'single-quoted uses, no node-version': stepWith(`uses: 'actions/setup-node@${PIN}'`),
    'other-case uses, no node-version': stepWith(`uses: Actions/Setup-Node@${PIN}`),
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
    setupSteps += text.split('\n').filter((line) => SETUP_NODE_USES.test(line)).length;
    assert.deepEqual(setupNodeProblems(text, NODE_MAJOR), [], file);
  }
  assert.ok(setupSteps >= 1, 'no actions/setup-node step found in the workflows');
});
