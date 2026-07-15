# Security Policy

## Scope

This is a static personal portfolio site (Astro, deployed to GitHub Pages). There's no backend,
no authentication, no user accounts, and no user-submitted data — the only inputs are content
files and dependencies in this repository. Realistic concerns are things like XSS via unescaped
content rendering, dependency/supply-chain issues, or CI workflow injection (see
`.github/workflows/`).

There's no versioning scheme to track — only the code currently deployed from `master` is
supported.

## Reporting a Vulnerability

Please report vulnerabilities privately rather than opening a public issue:

- Preferred: use GitHub's [private vulnerability reporting](https://github.com/daniel-kindl/daniel-kindl.github.io/security/advisories/new)
  for this repository.
- Alternatively, email daniel.kindl@proton.me with details and reproduction steps.

I'll acknowledge reports within a few days and aim to fix confirmed issues promptly given this is
a low-traffic personal site. No bug bounty is offered.
