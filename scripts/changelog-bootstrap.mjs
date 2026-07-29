// One-time helper: seeds CHANGELOG.md from full git history against the backfilled
// v0.0.2-v1.1.1 tags, using the same type/section mapping as release.config.mjs so the
// bootstrap output matches what semantic-release generates going forward.
//
// Not part of the ongoing release pipeline -- semantic-release owns CHANGELOG.md updates
// from here on, prepending new entries above this seed. Run once with:
//   node scripts/changelog-bootstrap.mjs
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const REPO_URL = 'https://github.com/daniel-kindl/daniel-kindl.github.io';
const FIRST_COMMIT = '1dbedc3';

const SECTIONS = [
  { type: 'feat', title: 'Features' },
  { type: 'fix', title: 'Bug Fixes' },
  { type: 'perf', title: 'Performance Improvements' },
  { type: 'revert', title: 'Reverts' },
  { type: 'docs', title: 'Documentation' },
  { type: 'chore', title: 'Chores & Dependencies' },
];

const tags = execFileSync('git', ['tag', '-l', 'v*', '--sort=version:refname'])
  .toString()
  .trim()
  .split('\n');

function commitsInRange(range) {
  return execFileSync('git', ['log', range, '--format=%h%x1f%s', '--reverse'])
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, subject] = line.split('\x1f');
      return { hash, subject };
    });
}

function tagDate(tag) {
  return execFileSync('git', ['log', '-1', '--format=%ad', '--date=format:%Y-%m-%d', tag])
    .toString()
    .trim();
}

const entries = [];

for (let i = 0; i < tags.length; i++) {
  const tag = tags[i];
  const prevTag = i === 0 ? null : tags[i - 1];
  const range = prevTag ? `${prevTag}..${tag}` : tag;
  const commits = commitsInRange(range);

  const bySection = new Map();
  for (const { hash, subject } of commits) {
    const match = subject.match(/^(\w+)(?:\([^)]+\))?!?:\s*(.+)$/);
    if (!match) continue;
    const [, type, description] = match;
    const section = SECTIONS.find((s) => s.type === type);
    if (!section) continue;
    if (!bySection.has(section.title)) bySection.set(section.title, []);
    bySection.get(section.title).push({ hash, description });
  }

  if (bySection.size === 0) continue;

  const compareBase = prevTag ?? FIRST_COMMIT;
  const version = tag.replace(/^v/, '');
  const lines = [
    `## [${version}](${REPO_URL}/compare/${compareBase}...${tag}) (${tagDate(tag)})`,
    '',
  ];

  for (const section of SECTIONS) {
    const items = bySection.get(section.title);
    if (!items) continue;
    lines.push(`### ${section.title}`, '');
    for (const { hash, description } of items) {
      lines.push(`* ${description} ([${hash}](${REPO_URL}/commit/${hash}))`);
    }
    lines.push('');
  }

  entries.push(lines.join('\n').trimEnd());
}

entries.reverse();

const header = '# Changelog\n\nAll notable changes to this project are documented here.\n';
writeFileSync('CHANGELOG.md', `${header}\n${entries.join('\n\n')}\n`);

console.log(`Wrote CHANGELOG.md with ${entries.length} release entries.`);
