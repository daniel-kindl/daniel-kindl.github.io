# Daniel Kindl Portfolio

[![CI](https://img.shields.io/github/actions/workflow/status/daniel-kindl/daniel-kindl.github.io/ci.yml?event=pull_request&label=CI&logo=githubactions&logoColor=white)](https://github.com/daniel-kindl/daniel-kindl.github.io/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/github/actions/workflow/status/daniel-kindl/daniel-kindl.github.io/deploy.yml?branch=master&label=Deploy&logo=githubactions&logoColor=white)](https://github.com/daniel-kindl/daniel-kindl.github.io/actions/workflows/deploy.yml)
[![Lighthouse](https://img.shields.io/github/actions/workflow/status/daniel-kindl/daniel-kindl.github.io/lighthouse.yml?branch=master&label=Lighthouse&logo=githubactions&logoColor=white)](https://github.com/daniel-kindl/daniel-kindl.github.io/actions/workflows/lighthouse.yml)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/node-%3E%3D26.3.0%20%3C27-339933?logo=node.js&logoColor=white)](https://nodejs.org)

Production portfolio site at [danielkindl.dev](https://danielkindl.dev), built with Astro 7,
TypeScript (strict), and Tailwind CSS 4. No island framework is installed. See ADR #15.

## Features

- Static project and writing pages from Zod-validated Astro content collections, authored in MDX
- Light and dark theme with no flash on load. The first visit follows the system preference.
- RSS feed, tag pages, and reading-time estimates on posts and case studies
- Sticky table of contents with scrollspy on any entry that has two or more headings
- Full-text search powered by [Pagefind](https://pagefind.app)
- One committed social-share image. The page title and description still change per page.

## Setup

Requires Node.js 26.3.0 or a later 26.x release. Node 27 and newer are not supported.

```
npm install
npm run dev
```

## Scripts

| Command                | Purpose                                             |
| :--------------------- | :-------------------------------------------------- |
| `./eng/verify.sh`      | Full gate: install, check, build; fails on warnings |
| `npm run check`        | Lint, check formatting, type-check, and run tests   |
| `npm run dev`          | Start the local development server                  |
| `npm run build`        | Build static production output                      |
| `npm run preview`      | Preview the built output                            |
| `npm run typecheck`    | Run Astro type checks                               |
| `npm test`             | Run the Node test suite                             |
| `npm run lint`         | Run ESLint                                          |
| `npm run lint:fix`     | Run ESLint with autofix                             |
| `npm run format`       | Format files with Prettier                          |
| `npm run format:check` | Check formatting with Prettier                      |

## CI/CD

Run `./eng/verify.sh` before you open a pull request. It installs the locked dependency tree when
needed, runs ESLint, a Prettier check, Astro type checks, the Node test suite, and the production
build, and fails on any warning.

A pull request to `master` runs `./eng/verify.sh` (`.github/workflows/ci.yml`). A push to `master`
runs the same script and deploys that output to GitHub Pages (`.github/workflows/deploy.yml`). The Lighthouse budget runs on every pull request to `master` and on `master` in `.github/workflows/lighthouse.yml`, one pass over the five URLs in
`lighthouserc.json`. A failure does not block the deploy. See ADR #18, ADR #20, and ADR #21.

Commit subjects stay a writing convention (`type: description`, with `content:` for entries under
`src/content/`). No Git hook rejects a subject. The `pr-title` check rejects a non-conventional pull-request title,
which becomes the squash commit subject. See ADR #17 and ADR #22.

## License

Different parts of this repository have different licenses.

- Code is under the MIT License. See [`LICENSE`](LICENSE).
- Blog posts in `src/content/writing` are under CC BY 4.0. See [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).

These items are not licensed for reuse. All rights are reserved:

- The CV text and the bio.
- Personal images.
- The logo.

The fonts keep their own license, SIL OFL 1.1. The license texts are in `public/fonts/*-OFL.txt`.

## Documentation

- [`AGENTS.md`](AGENTS.md): repository rules for coding agents. This is the canonical copy.
- [`docs/content.md`](docs/content.md): how to add a `projects` or `writing` entry.
- [`docs/design.md`](docs/design.md): color, typography, layout, and figures.
- [`docs/tech-decisions.md`](docs/tech-decisions.md): log of durable stack and tooling decisions.
- [`SECURITY.md`](SECURITY.md): how to report a vulnerability.
