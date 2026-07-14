# Daniel Kindl Portfolio

Production portfolio website built with Astro 7, TypeScript, Tailwind CSS 4, and selected Svelte 5 islands.

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

## Scripts

| Command                   | Purpose                                                 |
| :------------------------ | :------------------------------------------------------ |
| `npm run dev`             | Start local development server                          |
| `npm run build`           | Build static production output                          |
| `npm run preview`         | Preview built output                                    |
| `npm run typecheck`       | Run Astro type checks                                   |
| `npm run lint`            | Run ESLint                                              |
| `npm run lint:fix`        | Run ESLint with autofix                                 |
| `npm run format`          | Format files with Prettier                              |
| `npm run format:check`    | Check formatting with Prettier                          |
| `npm run generate-assets` | Regenerate OG images, icons, and `apple-touch-icon.png` |

When using Claude Code, start the dev server with `astro dev --background` and manage it with
`astro dev stop` / `astro dev status` / `astro dev logs`.

## CI/CD

Pull requests to `master` run `npm run generate-assets` → `npm run lint` → `npm run format:check` →
`astro check` → `npm run build` (`.github/workflows/ci.yml`). Pushes to `master` build the site,
run a Lighthouse CI budget check (`lighthouserc.json`), and deploy to GitHub Pages
(`.github/workflows/deploy.yml`).

Commits are enforced via Husky + commitlint using
[Conventional Commits](https://www.conventionalcommits.org/) (`type: description`, e.g. `feat:`,
`fix:`, `chore:`), and `lint-staged` runs ESLint/Prettier on staged files at commit time.

## Documentation

- [`docs/tech-decisions.md`](docs/tech-decisions.md) — ADR log for stack/tooling choices.
- [`docs/content-guide.md`](docs/content-guide.md) — how to add `projects`/`writing` content entries.
