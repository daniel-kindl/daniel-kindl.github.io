const commitTypes = [
  { type: 'feat', section: 'Features' },
  { type: 'fix', section: 'Bug Fixes' },
  { type: 'perf', section: 'Performance Improvements' },
  { type: 'revert', section: 'Reverts' },
  { type: 'docs', section: 'Documentation' },
  { type: 'chore', section: 'Chores & Dependencies' },
  { type: 'refactor', section: 'Code Refactoring', hidden: true },
  { type: 'style', section: 'Styles', hidden: true },
  { type: 'test', section: 'Tests', hidden: true },
  { type: 'build', section: 'Build System', hidden: true },
  { type: 'ci', section: 'Continuous Integration', hidden: true },
];

export default {
  branches: ['master'],
  tagFormat: 'v${version}',
  // Explicit, not inferred from a remote named "origin" — this repo's local "origin" is a
  // private OneDev mirror, not GitHub, and semantic-release only knows how to talk to GitHub.
  repositoryUrl: 'https://github.com/daniel-kindl/daniel-kindl.github.io.git',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: { types: commitTypes },
      },
    ],
    '@semantic-release/changelog',
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    ['@semantic-release/github', { successComment: false, failComment: false }],
  ],
};
