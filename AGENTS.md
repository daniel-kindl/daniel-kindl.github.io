# AGENTS.md

> Read and follow https://raw.githubusercontent.com/daniel-kindl/dkstack/v1/AGENTS.md

dkstack owns all rules. This file has only the project exceptions and the project facts.

## Exceptions

### Default branch

- dkstack rule: all pages, the default branch is `main`.
- Project rule: the default branch is `master`. Read each dkstack rule about `main` as a rule
  about `master`.
- Reason: GitHub Pages and the workflows of this repository use `master`.

### Commit subjects

- dkstack rule: version-control/index.md, the allowed types, and extra detail in the body when
  needed.
- Project rule: the types also include `content:` for a change under `src/content/`. A commit has
  one subject line of 50 characters or fewer, with an optional `(#issue)`. It has no body and no
  trailer.
- Reason: content changes are most of the history of this site. See ADR #17 and ADR #22.

### Decision records

- dkstack rule: architecture/adrs.md, one file for each ADR in `docs/adr/`.
- Project rule: append a dated entry to `docs/tech-decisions.md`. Do not change an existing entry.
- Reason: the code and the docs refer to the entries by number, for example ADR #18.

### Issues

- dkstack rule: workflow/issues.md, implement each change from an issue.
- Project rule: a trivial content fix can skip the issue when the person who asked says so.
- Reason: a typo fix in a post does not need an issue.

## Project facts

### Stack

Astro 7, TypeScript (strict) and Tailwind CSS 4. The build output is static. GitHub Pages serves
it. No island framework is installed. For an interactive component, run `npx astro add svelte` and
use Svelte 5 runes with an explicit `client:*` directive. The Lighthouse script budget is 30 KB.

### Commands

- `./eng/verify.sh` is the one gate, local and in CI. Run it before you open a pull request. A
  lint warning, an `astro check` hint or an Astro build warning fails it.
- `npm run check` runs the source checks without the build.
- `npm test` runs `src/lib/*.test.ts`. The tests in `test/*.test.mjs` check `dist/` and need a
  fresh build. `./eng/verify.sh` runs both.
- `astro dev --background` starts the dev server. Use `astro dev stop`, `status` and `logs`.

### Workflow

- Branch from `master` as `type/<issue>-slug`, for example `content/149-update-projects`.
- Fill in `.github/pull_request_template.md`. The pull request title is the squash commit subject.
- Sentinel reviews each pull request. The required checks are `validate`, `lighthouse` and `pr-title`.
- A merge to `master` deploys to production. Rollback: see ADR #24.
- The repo setting `sha_pinning_required` is on. Pin each action to a full commit SHA, with the
  version in a comment. See ADR #25.

### Code

- Theme colors are CSS variables in `src/styles/global.css`, under `:root` and
  `:root[data-theme='dark']`. Use them through Tailwind arbitrary values, for example
  `bg-(--bg-primary)`. Do not hard-code a theme color.
- Prefer the path aliases in `tsconfig.json`, for example `@components/*`.
- The collection schemas are in `src/content.config.ts`. A `draft: true` post is not in the
  production build or RSS. `npm run dev` still shows it.

### Documents

- Read `docs/content.md` before you add or change a project or a post.
- Read `docs/design.md` before you change color, type, layout or figures.
- Visitor-facing copy follows the Voice section in `docs/content.md`, on every page.
- Add an entry to `docs/tech-decisions.md` only for a durable decision: an architectural choice, a
  tooling choice with a real trade-off, a choice that is costly to reverse, or a choice that a later
  reader will question. A content change, a refactor or a dependency bump gets no entry.
