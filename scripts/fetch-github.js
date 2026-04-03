/**
 * Fetch GitHub Repos Script
 * Fetches public repositories from the GitHub API and saves them as a static
 * JSON file so the frontend never needs to call the API directly.
 *
 * Usage: node scripts/fetch-github.js
 * Output: data/github-repos.json
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const USERNAME = 'daniel-kindl';
const API_URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=50`;

const FIELDS_TO_KEEP = [
  'name',
  'description',
  'html_url',
  'homepage',
  'language',
  'stargazers_count',
  'updated_at',
  'topics',
  'forks_count',
];

function shapeRepo(repo) {
  const shaped = {};
  for (const field of FIELDS_TO_KEEP) {
    shaped[field] = repo[field] ?? null;
  }
  return shaped;
}

async function fetchRepos() {
  console.log(`Fetching repos for ${USERNAME}...`);

  const response = await fetch(API_URL, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'daniel-kindl-portfolio-build',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  const repos = await response.json();

  const filtered = repos
    .filter(repo => repo.fork === false)
    .map(shapeRepo);

  console.log(`Fetched ${repos.length} repos, kept ${filtered.length} non-forks.`);

  const output = {
    lastUpdated: new Date().toISOString(),
    repos: filtered,
  };

  mkdirSync(join(root, 'data'), { recursive: true });
  writeFileSync(
    join(root, 'data/github-repos.json'),
    JSON.stringify(output, null, 2),
    'utf8'
  );

  console.log('Saved data/github-repos.json');
}

fetchRepos().catch(err => {
  console.error('Failed to fetch GitHub repos:', err.message);
  process.exit(1);
});
