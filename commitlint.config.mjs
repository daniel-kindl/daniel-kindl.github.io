export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // config-conventional's default list plus `content`, which covers additions and edits to
    // src/content entries. See ADR #14 in docs/tech-decisions.md: content must not move the
    // version, so it needs a type outside semantic-release's feat/fix/perf release rules.
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'content',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
