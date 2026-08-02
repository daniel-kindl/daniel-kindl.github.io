# Daniel Kindl Portfolio

[![CI](https://img.shields.io/github/actions/workflow/status/daniel-kindl/daniel-kindl.github.io/ci.yml?event=pull_request&label=CI&logo=githubactions&logoColor=white)](https://github.com/daniel-kindl/daniel-kindl.github.io/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/github/actions/workflow/status/daniel-kindl/daniel-kindl.github.io/deploy.yml?branch=master&label=Deploy&logo=githubactions&logoColor=white)](https://github.com/daniel-kindl/daniel-kindl.github.io/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org)

Production portfolio site at [danielkindl.dev](https://danielkindl.dev), built with
Astro 7, TypeScript (strict) and Tailwind CSS 4. No island framework is installed — see ADR #15.

## Features

- Static, content-driven project and writing pages backed by Zod-validated Astro content
  collections, authored in MDX
- Light/dark theme toggle with no flash on load, following system preference until you choose
- RSS feed, tag-based browsing, and reading-time estimates on posts and case studies
- Sticky table of contents with scrollspy on any entry with two or more headings
- Full-text site search powered by [Pagefind](https://pagefind.app)
- Per-entry social share (OG) images generated at build time, not hand-drawn or committed

## Setup

`npm install` builds the native [`canvas`](https://www.npmjs.com/package/canvas) module (used by
`generate-assets.js`), which requires Cairo/Pango system libraries. On a fresh Debian/Ubuntu
machine, install them first:

```
sudo apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

(GitHub Actions' `ubuntu-latest` runner has these preinstalled, which is why CI doesn't need this
step.) See the [`node-canvas` install guide](https://github.com/Automattic/node-canvas#installation)
for other platforms.

Icons and OG images (`public/assets/meta/`, `public/apple-touch-icon.png`, `public/icon.svg`) are
generated, not committed. Run `npm run generate-assets` once after cloning, before `npm run dev` or
`npm run build`, otherwise those image requests will 404 locally. CI regenerates them fresh on every
run, so this is a local-only setup step.

## Scripts

| Command                   | Purpose                                                 |
| :------------------------ | :------------------------------------------------------ |
| `npm run dev`             | Start local development server                          |
| `npm run build`           | Build static production output                          |
| `npm run preview`         | Preview built output                                    |
| `npm run typecheck`       | Run Astro type checks                                   |
| `npm test`                | Run the `node --test` suite over `src/lib/*.test.ts`    |
| `npm run lint`            | Run ESLint                                              |
| `npm run lint:fix`        | Run ESLint with autofix                                 |
| `npm run format`          | Format files with Prettier                              |
| `npm run format:check`    | Check formatting with Prettier                          |
| `npm run generate-assets` | Regenerate OG images, icons, and `apple-touch-icon.png` |

When using Claude Code, start the dev server with `astro dev --background` and manage it with
`astro dev stop` / `astro dev status` / `astro dev logs`.

## CI/CD

Pull requests to `master` run `npm run generate-assets` → `npm run lint` → `npm run format:check` →
`astro check` → `npm test` → `npm run build` (`.github/workflows/ci.yml`). Pushes to `master` run
that same gate set, then a Lighthouse CI budget check (`lighthouserc.json`), then `semantic-release`,
then a second build so the footer carries the newly released version, and finally deploy to GitHub
Pages (`.github/workflows/deploy.yml`). Releasing after the gates rather than before means a failed
build can't leave a tag behind for a version that never shipped.

Commits are enforced via Husky + commitlint using
[Conventional Commits](https://www.conventionalcommits.org/) (`type: description`, e.g. `feat:`,
`fix:`, `chore:`), and `lint-staged` runs ESLint/Prettier on staged files at commit time. Entries
under `src/content/` use a repo-specific `content:` type, which is excluded from semantic-release's
release rules so publishing a post or case study doesn't move the site version.

## Documentation

- [`docs/tech-decisions.md`](docs/tech-decisions.md): ADR log for stack/tooling choices.
- [`docs/content-guide.md`](docs/content-guide.md): how to add `projects`/`writing` content entries,
  including media and in-content components.
- [`DESIGN.md`](DESIGN.md): the design system, with the named rules that govern color, typography,
  separation, and figures.
- [`CLAUDE.md`](CLAUDE.md): architecture and conventions, written for Claude Code but accurate for
  anyone.
