# AGENTS.md

This file is the instruction source for agents that work in this repository. `CLAUDE.md` imports
this file.

## Project

Daniel Kindl's portfolio site uses Astro 7, TypeScript (strict), and Tailwind CSS 4. No island
framework is installed. The build output is static. GitHub Pages serves the site.

## Commands

Run `npm run check` before you open a pull request. The command runs the linter, the format check,
the type check, and the tests.

Pull-request CI (`.github/workflows/ci.yml`) runs `npm ci`, then `npm run check`, then
`npm run build`. That run is the merge gate.

Deploy (`.github/workflows/deploy.yml`) runs on a push to `master`, or on `workflow_dispatch`. It
runs `npm ci`, then `npm run build`, then publishes to GitHub Pages. Deploy does not run
`npm run check`.

Lighthouse (`.github/workflows/lighthouse.yml`) runs on a push to `master`, or on
`workflow_dispatch`. It measures the five URLs in `lighthouserc.json` once. It does not run on a
pull request. A failure does not block the deploy. See ADR #18 in `docs/tech-decisions.md`.

Start the dev server in the background:

```
astro dev --background
```

Stop it with `astro dev stop`. Read status with `astro dev status`. Read logs with
`astro dev logs`.

`npm test` runs Node's test runner on `src/lib/*.test.ts`. The tests cover pure helpers that do
not import `astro:content` values. `src/lib/content.ts` is out of scope. The directory-sync tool
named in the project content is a separate C# repository.

## Commit subjects

Use one line: `type: short imperative description`. You may add `(#issueNumber)` at the end. Do not
add a body or a trailer. Use `content:` for a change under `src/content/`. Use `feat:` or `fix:`
for a change to the site. No hook and no workflow rejects a subject. See ADR #17 in
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
