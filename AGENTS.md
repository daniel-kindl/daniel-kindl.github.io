# AGENTS.md

Guidance for AI coding agents working in this repository. See also `CLAUDE.md` (kept in sync with
this file) and `docs/tech-decisions.md` for the ADR log behind these choices.

## Project

Daniel Kindl's portfolio site: Astro 7 + TypeScript (strict) + Tailwind CSS 4, with Svelte 5 islands
for interactive "playground" pieces. Static output, deployed to GitHub Pages.

## Commands

```
npm run dev             # astro dev — foreground. See below for background mode.
npm run build            # astro build — static output to dist/
npm run preview          # preview built output
npm run typecheck        # astro check
npm run lint             # eslint .
npm run lint:fix         # eslint . --fix
npm run format            # prettier --write .
npm run format:check     # prettier --check .
npm run generate-assets  # regenerate public/assets/meta and public/assets/projects PNGs + icon.svg (uses `canvas`)
```

There is no test runner/test script in this repo (`directory-sync-tool` project referenced in
content is a separate C#/.NET repo with its own xUnit suite — not this one).

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

CI (`.github/workflows/ci.yml`) runs on PRs to `master`: `npm run generate-assets` → `astro check` →
`npm run build`. Deploy (`.github/workflows/deploy.yml`) runs on push to `master`: build, then a
Lighthouse CI budget check (`lighthouserc.json`) before publishing to GitHub Pages. If you change
anything affecting bundle size, LCP, or accessibility, expect Lighthouse to gate the deploy.

Commits are enforced via Husky + commitlint (Conventional Commits: `type: description`,
e.g. `feat:`, `fix:`, `chore:`). `lint-staged` runs ESLint/Prettier on staged files at commit time.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

`docs/tech-decisions.md` is an ADR log for stack/tooling choices (Node version, Astro, Svelte,
Tailwind v4, ESLint flat config, commit discipline, `tsconfig` path aliases, fonts). Append new
dated entries there when making a comparable decision — don't edit existing ones.

## Architecture

**Content is data-driven via two Zod-validated collections** (`src/content.config.ts`), loaded
from `src/content/{projects,writing}/*.md`:

- `projects`: title, summary, role, stack, links (production/repository, both optional URLs),
  status (`development | production | archived`), dates (start/end), optional coverImage,
  `weight` (int, controls homepage feature ordering — higher sorts first).
- `writing`: title, summary, date, tags (string array), draft (bool — draft posts are excluded from
  builds and RSS except in `import.meta.env.DEV`).

Dynamic routes (`src/pages/projects/[id].astro`, `src/pages/writing/[id].astro`,
`src/pages/writing/tags/[tag].astro`) use `getStaticPaths()` + `getCollection()` to statically
render one page per entry. Tag pages are derived by scanning all posts' `tags` and slugifying them
(`src/lib/slug.ts`) into a `Map` — there's no separate tags collection. `src/pages/rss.xml.js` uses
`@astrojs/rss` over the same `writing` collection.

**Path aliases** (`tsconfig.json`): `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`,
`@content/*`, `@assets/*` all map to `./src/...`. Existing `.astro` pages under `src/pages/` mostly
use relative imports instead (established before the aliases existed); newer code (e.g.
`src/lib/buttonStyles.ts` consumers, `Footer.astro`) uses the aliases. Prefer aliases for new code.

**UI primitives** (`src/components/ui/`) are small, variant-driven Astro components composed into
page-level layouts — `Container`, `Typography` (h1/h2/h3/body/eyebrow/mono variants), `Button` /
`ExternalLink` (share variant classes from `src/lib/buttonStyles.ts`; `ExternalLink` always sets
`target="_blank" rel="noopener noreferrer"` and appends a screen-reader "(opens in new tab)" label
plus an optional icon), `Tag`, `Timeline`/`TimelineEvent`. `src/components/portfolio/` holds
content-specific composites (`ProjectCard`, `WritingPostCard`, `CodeBlock` — wraps `astro:components`
`Code` for syntax highlighting via Shiki, theme `css-variables`).

**Theming uses a `data-theme` attribute, not Tailwind's `.dark` class.** `ThemeScript.astro`
(inlined in `<head>` before paint, to avoid FOUC) and the inline script in `Header.astro` read/write
`document.documentElement.dataset.theme` + `localStorage.theme`, and re-run on
`astro:page-load`/`astro:after-swap` for View Transitions. CSS variables (`--bg-primary`,
`--text-primary`, `--text-muted`, `--border-color`) are defined in `src/styles/global.css` under
`:root` and `:root[data-theme='dark']`, and components consume them via Tailwind's arbitrary-value
syntax `bg-(--bg-primary)` / `text-(--text-primary)`, not Tailwind theme color utilities.
`src/styles/tokens.css` (a `.dark`-class-based `@theme` token file, per ADR-4 in
`docs/tech-decisions.md`) and `src/components/islands/ThemeToggle.svelte` (which toggles the `.dark`
class) are **not wired into the site** — `tokens.css` isn't imported anywhere and `ThemeToggle.svelte`
isn't rendered on any page. Don't assume either is live; the working theme system is the
`data-theme`/`global.css` pair described above.

**Svelte islands are opt-in and currently unused on live pages.** `src/components/islands/` and
`src/components/playground/` (`MainActionButton.svelte`, `MatrixWave.svelte`) exist but aren't
imported by any `.astro` page yet — check before assuming a component is rendered anywhere. Per
ADR-3, new interactive components should use Svelte 5 runes (`$state`, etc.), not the legacy
`export let` API, and should only hydrate via explicit `client:*` directives.

**Global layout**: `src/layouts/Layout.astro` is the single page shell (meta/OG/Twitter tags,
font preloads, `ThemeScript`, `ClientRouter` for View Transitions, skip-to-content link, `Header` +
`<main>` + `Footer`). Every page wraps its content in it with a `title` prop (and optional
`description`/`ogImage`).

**Static data**: `src/data/cv.ts` exports `technicalProfile`, consumed only by `src/pages/about.astro`
to render skills/experience via `Timeline`.

**Asset generation**: `generate-assets.js` uses `node-canvas` to procedurally generate OG images,
favicons, and project cover placeholders into `public/assets/`. It runs in CI before every build —
run it locally after adding a new project if you need its placeholder cover image.
