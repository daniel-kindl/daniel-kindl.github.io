# AGENTS.md

This file is the instruction source for agents that work in this repository. `CLAUDE.md` imports
this file.

## Project

Daniel Kindl's portfolio site uses Astro 7, TypeScript (strict), and Tailwind CSS 4. No island
framework is installed. The build output is static. GitHub Pages serves the site.

## Commands

Run `./eng/verify.sh` before you open a pull request. It is the one local and CI entry point. It
runs `npm ci` (in CI, or when `node_modules` is missing), the linter, the format check, the type
check, the tests, and the production build. A lint warning, an `astro check` warning or hint, or an
Astro build warning fails it. `npm run check` still runs the four source checks without the build.

Pull-request CI (`.github/workflows/ci.yml`) runs `./eng/verify.sh`. That run is the merge gate.

Deploy (`.github/workflows/deploy.yml`) runs on a push to `master`, or on `workflow_dispatch`. It
runs `./eng/verify.sh`, then publishes `dist/` to GitHub Pages. See ADR #20.

Lighthouse (`.github/workflows/lighthouse.yml`) runs on a pull request to `master`, on a push to
`master`, and on `workflow_dispatch`. It measures the five URLs in `lighthouserc.json` once. The
`lighthouse` check is required on a pull request. A failure on `master` does not block the deploy.
See ADR #18 and ADR #21 in `docs/tech-decisions.md`.

Start the dev server in the background:

```
astro dev --background
```

Stop it with `astro dev stop`. Read status with `astro dev status`. Read logs with
`astro dev logs`.

`npm test` runs Node's test runner on `src/lib/*.test.ts`. The tests cover pure helpers that do
not import `astro:content` values. `src/lib/content.ts` is out of scope. `./eng/verify.sh` also runs
`node --test "test/*.test.mjs"` after the build. Those tests check `dist/`: internal links and
anchors, RSS and sitemap URLs, and that no `draft: true` post ships. They need a fresh build. The directory-sync tool
named in the project content is a separate C# repository.

## Agent workflow

This site keeps one long-lived branch, `master`. There is no `dev` branch and no SemVer.

1. Start from an issue. Read the issue and its acceptance criteria. A trivial content fix may skip
   the issue when the person who asked says so.
2. Branch from `master` as `type/<issue>-slug` (for example `chore/86-verify-script`). Use the
   commit-subject types below.
3. Run `./eng/verify.sh`. Mark anything you could not run as NOT RUN.
4. Open a pull request against `master`. Use a Conventional Commits title (the `pr-title` check
   enforces it; the squash commit uses it). Fill in `.github/pull_request_template.md`: `Closes #n`,
   what changed, and the verify output.
5. Sentinel reviews the pull request. Fix review items on the same branch with new commits. Do not
   force-push a branch under review. Merge `master` into the branch to resolve conflicts.
6. A human or the coordinating agent merges after the required checks pass. Agents never push to
   `master` and never merge their own pull requests. The protect-master ruleset enforces pull
   requests and squash merges.

Do not weaken a gate (lint rules, `astro check` severity, Lighthouse budgets, required checks) to
get a pull request green. Propose the change in the pull request and record a durable change as an
ADR.

## Commit subjects

Use one line: `type: short imperative description`. You may add `(#issueNumber)` at the end. Do not
add a body or a trailer. Use `content:` for a change under `src/content/`. Use `feat:` or `fix:`
for a change to the site. No Git hook rejects a subject. The `pr-title` check rejects a pull-request
title that does not match, and the squash merge uses that title. See ADR #17 and ADR #22 in
`docs/tech-decisions.md`.

## Documents

Read `docs/content.md` before you add or edit a project or a writing entry. Read `docs/design.md`
before you change color, type, layout, or figures.

Append an entry to `docs/tech-decisions.md` only for a durable decision. A durable decision has
one or more of these properties:

- The choice is architectural.
- The choice is a tooling or platform choice with a real trade-off.
- The choice is costly to reverse.
- A later reader is likely to question the choice.
- A future contributor needs the reason.

Leave existing entries unchanged. When a decision changes, append a new dated entry.

These changes do not get an entry:

- a routine refactor
- a content change
- a dependency bump
- a formatting choice
- an implementation detail that the code already shows

## Architecture

Two Zod collections live in `src/content.config.ts`. Files live in
`src/content/{projects,writing}/*.{md,mdx}`. Every entry is `.mdx`.

`projects` fields: title, summary, role, stack, links (`production`, `repository`, `release`),
status (`development | finished | maintaining | archived`), dates (`start`, `end`), and `weight`.
`release` renders a third "View Release" button when the URL is present. A higher `weight` sorts
first on the homepage.

`writing` fields: title, summary, date, tags, and draft. A draft post is absent from the production
build and from RSS. `npm run dev` still renders it (`import.meta.env.DEV`).

These routes use `getStaticPaths()` and `getCollection()`:

- `src/pages/projects/[id].astro`
- `src/pages/writing/[id].astro`
- `src/pages/writing/tags/[tag].astro`

Tag pages come from each post's `tags`, through `src/lib/slug.ts`. There is no tags collection.
`src/pages/rss.xml.ts` builds the feed with `@astrojs/rss`.

Path aliases in `tsconfig.json`: `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`,
`@content/*`, `@assets/*`. Prefer an alias in new code.

UI primitives live in `src/components/ui/`. Portfolio composites live in
`src/components/portfolio/`. Content components live in `src/components/content/` (`Figure`,
`Swatch`). A figure is evidence. Read the Media & Figures section in `docs/design.md` before you
add one.

The theme uses a `data-theme` attribute. `ThemeScript.astro` and the script in `Header.astro` read
and write `document.documentElement.dataset.theme` and `localStorage.theme`. CSS variables live in
`src/styles/global.css` under `:root` and `:root[data-theme='dark']`. Use Tailwind arbitrary values
such as `bg-(--bg-primary)` and `text-(--text-primary)`. Keep theme colors on those variables.

No island framework is installed. To add an interactive component, run `npx astro add svelte`, then
write the component with Svelte 5 runes (`$state`). Hydrate only with an explicit `client:*`
directive. The Lighthouse script budget is 30 KB.

`src/layouts/Layout.astro` is the page shell. Pass `title`. `description` and `ogImage` are
optional. The default share image is `/assets/meta/og-default.png`.

`src/data/cv.ts` exports `technicalProfile`. Only `src/pages/about.astro` reads it.

Icons and the share image are committed files under `public/`. Keep them as static files. `og:title`
and `og:description` already change per page. See ADR #19 in `docs/tech-decisions.md`.

## Copy

Visitor-facing copy follows the Voice section in `docs/content.md`. That includes pages outside
the content collections.
