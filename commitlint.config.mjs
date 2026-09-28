export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // config-conventional's default list plus `content`, which covers additions and edits to
    // src/content entries. The type keeps a post or case study distinct from a site change.
    // See ADR #16 in docs/tech-decisions.md.
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
