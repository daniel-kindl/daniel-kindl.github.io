import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const RELEASE_PRIORITY = { patch: 1, minor: 2, major: 3 };

const CHANGELOG_SECTIONS = [
  ['feat', 'Features'],
  ['fix', 'Bug Fixes'],
  ['perf', 'Performance Improvements'],
  ['revert', 'Reverts'],
  ['content', 'Content'],
  ['docs', 'Documentation'],
  ['chore', 'Chores & Dependencies'],
];

export function parseCommit(message) {
  const [header = '', ...bodyLines] = message.trim().split('\n');
  const match = header.match(/^([a-zA-Z][\w-]*)(?:\(([^)]+)\))?(!)?:\s+(.+)$/);

  if (!match) return null;

  const [, type, scope, bang, subject] = match;
  const body = bodyLines.join('\n');
  const breakingFooter = /^BREAKING(?: CHANGE|-CHANGE):\s+.+$/m.test(body);

  return {
    type,
    scope: scope ?? null,
    subject,
    breaking: Boolean(bang) || breakingFooter,
  };
}

export function getReleaseType(commits) {
  let releaseType = null;

  for (const commit of commits) {
    const parsed = parseCommit(commit.message);
    if (!parsed) continue;

    let candidate = null;
    if (parsed.breaking) candidate = 'major';
    else if (parsed.type === 'feat') candidate = 'minor';
    else if (['fix', 'perf', 'revert'].includes(parsed.type)) candidate = 'patch';

    if (candidate && (!releaseType || RELEASE_PRIORITY[candidate] > RELEASE_PRIORITY[releaseType])) {
      releaseType = candidate;
    }
  }

  return releaseType;
}

export function bumpVersion(version, releaseType) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`Unsupported version: ${version}`);

  let [, major, minor, patch] = match.map(Number);

  if (releaseType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (releaseType === 'minor') {
    minor += 1;
    patch = 0;
  } else if (releaseType === 'patch') {
    patch += 1;
  } else {
    throw new Error(`Unsupported release type: ${releaseType}`);
  }

  return `${major}.${minor}.${patch}`;
}

function linkIssueReferences(subject, repositoryUrl) {
  return subject.replace(/#(\d+)\b/g, (_, number) => `[#${number}](${repositoryUrl}/issues/${number})`);
}

function formatCommit(commit, repositoryUrl) {
  const parsed = parseCommit(commit.message);
  if (!parsed) return null;

  const subject = linkIssueReferences(parsed.subject, repositoryUrl);
  const description = parsed.scope ? `**${parsed.scope}:** ${subject}` : subject;
  const shortSha = commit.sha.slice(0, 7);

  return `* ${description} ([${shortSha}](${repositoryUrl}/commit/${commit.sha}))`;
}

export function buildChangelogEntry({ version, lastTag, date, repositoryUrl, commits }) {
  const lines = [
    `## [${version}](${repositoryUrl}/compare/${lastTag}...v${version}) (${date})`,
    '',
  ];

  const breaking = commits.filter((commit) => parseCommit(commit.message)?.breaking);
  if (breaking.length > 0) {
    lines.push('### BREAKING CHANGES', '');
    for (const commit of breaking) {
      const formatted = formatCommit(commit, repositoryUrl);
      if (formatted) lines.push(formatted);
    }
    lines.push('');
  }

  for (const [type, title] of CHANGELOG_SECTIONS) {
    const matching = commits.filter((commit) => parseCommit(commit.message)?.type === type);
    if (matching.length === 0) continue;

    lines.push(`### ${title}`, '');
    for (const commit of matching) {
      const formatted = formatCommit(commit, repositoryUrl);
      if (formatted) lines.push(formatted);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function readGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function runGit(args) {
  execFileSync('git', args, { stdio: 'inherit' });
}

function getCommits(lastTag) {
  const raw = readGit(['log', `${lastTag}..HEAD`, '--format=%H%x1f%B%x1e']);
  if (!raw) return [];

  return raw
    .split('\x1e')
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const separator = record.indexOf('\x1f');
      if (separator < 0) throw new Error('Unable to parse git log output.');
      return {
        sha: record.slice(0, separator).trim(),
        message: record.slice(separator + 1).trim(),
      };
    });
}

function updateVersionFiles(version) {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const packageLock = JSON.parse(readFileSync('package-lock.json', 'utf8'));

  packageJson.version = version;
  packageLock.version = version;

  if (!packageLock.packages?.['']) {
    throw new Error('package-lock.json does not contain the root package entry.');
  }
  packageLock.packages[''].version = version;

  writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
  writeFileSync('package-lock.json', `${JSON.stringify(packageLock, null, 2)}\n`);
}

function prependChangelog(entry) {
  const current = readFileSync('CHANGELOG.md', 'utf8').trimStart();
  writeFileSync('CHANGELOG.md', `${entry}\n${current}`);
}

function extractReleaseBody(changelog, version) {
  const marker = `## [${version}]`;
  const start = changelog.indexOf(marker);
  if (start < 0) throw new Error(`CHANGELOG.md has no entry for ${version}.`);

  const next = changelog.indexOf('\n## [', start + marker.length);
  const entry = changelog.slice(start, next < 0 ? undefined : next).trim();
  return entry.split('\n').slice(2).join('\n').trim();
}

function repositorySlug() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  throw new Error('GITHUB_REPOSITORY is required for release publishing.');
}

async function ensureGitHubRelease(tag, body) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required for release publishing.');

  const repository = repositorySlug();
  const baseUrl = `https://api.github.com/repos/${repository}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const existing = await fetch(`${baseUrl}/releases/tags/${encodeURIComponent(tag)}`, { headers });
  if (existing.ok) return;
  if (existing.status !== 404) {
    throw new Error(`GitHub release lookup failed with HTTP ${existing.status}.`);
  }

  const created = await fetch(`${baseUrl}/releases`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tag_name: tag, name: tag, body }),
  });

  if (!created.ok) {
    const details = await created.text();
    throw new Error(`GitHub release creation failed with HTTP ${created.status}: ${details}`);
  }
}

function tagExists(tag) {
  try {
    readGit(['rev-parse', '--verify', `refs/tags/${tag}`]);
    return true;
  } catch {
    return false;
  }
}

export async function main({ dryRun = process.argv.includes('--dry-run') } = {}) {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const lastTag = readGit(['describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*']);
  const expectedTag = `v${packageJson.version}`;

  if (lastTag !== expectedTag) {
    throw new Error(`Version ${packageJson.version} does not match latest tag ${lastTag}.`);
  }

  const commits = getCommits(lastTag);
  const releaseType = getReleaseType(commits);

  if (!releaseType) {
    console.log('No release required.');
    if (!dryRun && process.env.GITHUB_TOKEN && tagExists(expectedTag)) {
      const changelog = readFileSync('CHANGELOG.md', 'utf8');
      await ensureGitHubRelease(expectedTag, extractReleaseBody(changelog, packageJson.version));
    }
    return;
  }

  const nextVersion = bumpVersion(packageJson.version, releaseType);
  const tag = `v${nextVersion}`;
  const repositoryUrl = `https://github.com/${repositorySlug()}`;
  const entry = buildChangelogEntry({
    version: nextVersion,
    lastTag,
    date: new Date().toISOString().slice(0, 10),
    repositoryUrl,
    commits,
  });

  if (dryRun) {
    console.log(`${releaseType} release -> ${nextVersion}`);
    console.log(entry);
    return;
  }

  updateVersionFiles(nextVersion);
  prependChangelog(entry);

  runGit(['config', 'user.name', 'github-actions[bot]']);
  runGit(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  runGit(['add', 'package.json', 'package-lock.json', 'CHANGELOG.md']);
  runGit(['commit', '--no-verify', '-m', `chore(release): ${nextVersion} [skip ci]`]);
  runGit(['tag', tag]);
  runGit(['push', 'origin', 'HEAD:master']);
  runGit(['push', 'origin', tag]);

  await ensureGitHubRelease(tag, entry.split('\n').slice(2).join('\n').trim());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
