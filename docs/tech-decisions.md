# Tech Decisions

ADR-style log of stack and tooling decisions for this project. One entry per decision:
**Status / Context / Decision / Consequences.** Append new entries as decisions are made or
revisited — don't edit history, add a new dated entry if a decision changes.

---

## 1. Runtime: Node.js 24 (LTS)

**Status:** Accepted — 2026-07-11

**Context:** Node has moved to a yearly major-release cadence. As of this decision, Node 24 is
the current Active LTS line; Node 22 is in Maintenance-only LTS (security patches until April
2027, no new features); Node 26 is the Current (non-LTS) line, not recommended for production
until it reaches LTS status in October 2026.

**Decision:** Pin to Node 24.x via `.nvmrc` (`24`) and `package.json` `engines.node: ">=24.0.0"`.

**Consequences:** Contributors run `nvm use` to match. Revisit when Node 24 moves to
Maintenance LTS (expected ~2027) or when a feature we need requires Node 26+.

---

## 2. Framework: Astro 7

**Status:** Accepted — 2026-07-11

**Context:** The site is a static-first portfolio/playground hosted on GitHub Pages — no
server runtime needed. Astro's island architecture ships zero JS by default and only hydrates
components that are explicitly marked interactive, which fits a mostly-static content site with
a handful of interactive "playground" pieces. Astro 7 is the current stable major.

**Decision:** Astro `^7.0`, TypeScript strict mode (`astro/tsconfigs/strict`).

**Consequences:** Content pages (projects, writing) render as static HTML with no JS cost.
Interactive pieces are opt-in per component via `client:*` directives. Astro's Content
Collections (with Zod schemas) give us type-checked frontmatter at build time instead of loose
markdown.

---

## 3. Island framework: Svelte 5

**Status:** Accepted — 2026-07-11

**Context:** A handful of interactive "playground" components need a real framework
(state, reactivity) rather than vanilla JS, but the site shouldn't ship a full framework
runtime to every page. Astro supports multiple island frameworks (React, Vue, Svelte, Preact,
Solid); the choice only affects the hydrated islands, not the static pages.

**Decision:** Svelte `^5.x` via `@astrojs/svelte`, used exclusively for `src/components/islands/`.

**Consequences:** Smallest runtime footprint of the mainstream options, which matters since
these components hydrate client-side. Svelte 5's runes API is the current idiomatic style —
new Svelte code should use runes, not the legacy `export let` reactivity model.

---

## 4. Styling: Tailwind CSS 4

**Status:** Accepted — 2026-07-11

**Context:** Tailwind v4 removed the JS config file (`tailwind.config.js`) in favor of a
CSS-first config via `@theme` blocks directly in the stylesheet. This is a meaningful
architecture change from most existing Tailwind tutorials/docs online, which still show v3's
`tailwind.config.js` with `theme.extend`.

**Decision:** Tailwind `^4.x` via `@tailwindcss/vite`. Design tokens (type scale, color
palette, spacing, motion) will be defined directly in `src/styles/tokens.css` using `@theme`,
making the token file itself the Tailwind config — no separate JS config to keep in sync.

**Consequences:** Anyone referencing Tailwind docs/tutorials for this project needs to confirm
they're v4-aware; v3 config patterns (`tailwind.config.js`) don't apply. Custom design tokens
defined in Epic 1 become directly available as Tailwind utility classes with no bridging layer.

---

## 5. Linting & formatting: ESLint 10 (flat config) + Prettier 3

**Status:** Accepted — 2026-07-11

**Context:** ESLint 9+ uses flat config (`eslint.config.mjs`) instead of `.eslintrc.*`.
Current `eslint-plugin-astro` requires ESLint 10+. `typescript-eslint`'s `tseslint.config()`
helper is deprecated in favor of ESLint core's own `defineConfig()`.

**Decision:** ESLint `^10.x` with flat config via `defineConfig()`, `typescript-eslint` for TS
rules, `eslint-plugin-astro` and `eslint-plugin-svelte` for framework-specific linting.
Prettier `^3.x` with `prettier-plugin-astro`, `prettier-plugin-svelte`, and
`prettier-plugin-tailwindcss` (class sorting — must be listed last in the plugins array).

**Consequences:** Config uses the current, non-deprecated APIs from day one instead of
accumulating deprecation warnings. `npm run lint` / `npm run format` / `npm run typecheck`
are the standard local checks; VS Code is configured to format-on-save via `.vscode/settings.json`.

---

## 6. Commit discipline: Husky + commitlint (Conventional Commits)

**Status:** Accepted — 2026-07-11

**Context:** With two Git remotes (local OneDev + GitHub) and issue-by-issue development, commit
messages need to be consistent enough to trace back to backlog items and, eventually, support
automated changelog generation.

**Decision:** `husky` manages Git hooks; `@commitlint/cli` + `@commitlint/config-conventional`
enforce [Conventional Commits](https://www.conventionalcommits.org/) format on every commit via
a `commit-msg` hook. `lint-staged` runs ESLint/Prettier on staged files only via a `pre-commit`
hook.

**Consequences:** Commits that don't match `type: description` format (e.g. `feat:`, `fix:`,
`chore:`) are rejected locally, before they ever reach either remote. Commit messages reference
OneDev issue numbers by convention (e.g. `chore: add husky and commitlint (#1)`) though this
isn't currently enforced by tooling.

---

## 7. Module resolution: `paths` without `baseUrl`

**Status:** Accepted — 2026-07-11

**Context:** TypeScript 6.0 deprecated `baseUrl` as a module-resolution lookup root (removed
entirely in TS 7.0). `paths` has not required `baseUrl` since TS 4.1 — writing each path entry
with an explicit `./` prefix is now the recommended pattern.

**Decision:** `tsconfig.json` defines `paths` aliases (`@components/*`, `@layouts/*`, `@lib/*`,
`@styles/*`, `@content/*`, `@assets/*`) with explicit `./src/...` prefixes and no `baseUrl`.

**Consequences:** Config is forward-compatible with TS 7.0 without needing
`ignoreDeprecations`. Astro/Vite's bundler resolution reads `tsconfig.json` paths natively, so
no separate Vite alias config is needed — verified once real files exist under
`src/components/`.

---

## 8. Typefaces: Space Grotesk / JetBrains Mono / IBM Plex Sans

**Status:** Accepted — 2026-07-11

**Context:** Self-hosting fonts (not Google Fonts CDN) means license terms matter upfront.
All three candidates needed to permit self-hosting/webfont embedding without restriction.

**Decision:** Space Grotesk (display), JetBrains Mono (monospace/accent), IBM Plex Sans (body).
All SIL OFL 1.1 — free commercial use, no attribution required, variable font format (single
file per family covers the full weight range).

**Consequences:** No licensing risk. Variable fonts keep `public/fonts/` small — 3 files total
instead of one per weight. Space Grotesk has no italic; use weight/color for emphasis instead.

---

## 9. Theming: `data-theme` attribute + `global.css`, not `tokens.css`/`.dark` class

**Status:** Accepted — 2026-07-14

**Context:** ADR-4 planned `src/styles/tokens.css` as the Tailwind `@theme` config, with dark mode
via a `.dark` class. Implementation diverged: the theme toggle (`ThemeScript.astro`, `Header.astro`)
sets a `data-theme="dark"` attribute on `<html>`, and `src/styles/global.css` defines the actual
`--bg-primary`/`--text-primary`/`--text-muted`/`--border-color` variables under
`:root`/`:root[data-theme='dark']`. `tokens.css` was never imported anywhere and had no effect.

**Decision:** Delete `tokens.css`. `global.css` + the `data-theme` attribute is the theme system;
components consume tokens via Tailwind arbitrary-value syntax (`bg-(--bg-primary)`), not `@theme`
color utilities.

**Consequences:** No dead file conflicting with the live implementation. Any future rework of the
token/theme system should extend `global.css` directly rather than reintroducing a `.dark`-class
config file.

---

## 10. TypeScript: staying on `^6.0.3`, not upgrading to 7 yet

**Status:** Accepted — 2026-07-14

**Context:** TypeScript 7 (`7.0.2`) is out and ADR-7 was written anticipating it. Attempted the
bump: `@astrojs/language-server` (via `@astrojs/check`, which backs `astro check`) crashes
outright on TS 7 (`Cannot read properties of undefined (reading 'fileExists')` in
`AstroCheck.getTsconfig`), and `typescript-eslint@8.63.0`'s peer dependency caps at
`typescript@>=4.8.4 <6.1.0` — npm only warns, but the crash confirms real incompatibility, not
just an unacknowledged peer range.

**Decision:** Stay on `typescript@^6.0.3` until `@astrojs/check`/`@astrojs/language-server` and
`typescript-eslint` both ship TS 7 support.

**Consequences:** Re-attempt this bump by running `npm run typecheck` after upgrading — if it
still crashes, the toolchain isn't ready yet. Don't bump `typescript` alone without re-verifying.

---

## 11. Release automation: `semantic-release`, not release-please

**Status:** Accepted — 2026-07-29

**Context:** The homegrown bump logic in `deploy.yml` only inspected `github.event.head_commit.message`
(a single commit, not the full set of commits in a push), never created a git tag, and had no
changelog. ADR #6 anticipated commit discipline eventually supporting "automated changelog
generation." `googleapis/release-please` was evaluated first, but its core mechanism is a
standing "release PR" that a human must merge — this conflicts with the requirement for zero
manual intervention on every release (no PR to click through). `semantic-release` releases
directly on push instead, with no PR step.

**Decision:** `semantic-release` runs as a step inside `.github/workflows/deploy.yml`'s existing
`deploy` job, positioned after `npm ci` and before `npm run build` (not a separate workflow —
`src/lib/buildInfo.ts` embeds `pkg.version` and the current commit hash into every page at build
time, so the version bump must land before the build step, in the same job). On each push to
`master` it uses `@semantic-release/commit-analyzer` + `@semantic-release/release-notes-generator`
(both with the `conventionalcommits` preset, correctly handling `!` and `BREAKING CHANGE:`
footers) to compute the next version from all commits since the last `vX.Y.Z` tag, then
`@semantic-release/changelog`, `@semantic-release/npm` (`npmPublish: false`), and
`@semantic-release/git` update `CHANGELOG.md`/`package.json`/`package-lock.json`, commit
(`chore(release): X.Y.Z [skip ci]`), tag, and push, and `@semantic-release/github` creates the
GitHub Release. `chore`-type commits (Dependabot's style) are visible in `CHANGELOG.md` under a
"Chores & Dependencies" section but don't trigger a release by themselves — this is the library's
default behavior, not a special-cased override. Nine annotated tags (`v0.0.2`-`v1.1.1`) were
backfilled onto their historical commits and `CHANGELOG.md` was bootstrapped once with a small
local script (`scripts/changelog-bootstrap.mjs`) before automated releases took over.
`scripts/sync-mirror.ps1` now also mirrors tags from `hosting` (GitHub) to `origin` (OneDev),
one-way and non-destructively, same as the branch.

**Consequences:** No release PR ever exists to forget to merge — every push to `master` that
contains a `feat`/`fix`/`perf`/breaking commit releases immediately and automatically. The
tradeoff versus release-please is less visibility/review before a release ships (no PR diff to
eyeball CHANGELOG output before it's live), acceptable for a solo portfolio project. Husky's
`commit-msg`/`pre-commit` hooks are disabled for this one step via `HUSKY=0`, since
`@semantic-release/git`'s commit is not run with `--no-verify` and would otherwise be subject to
hooks meant for human contributors. A chore-only stretch (e.g. several weeks of only Dependabot
bumps) produces no release/tag/changelog entry on its own; those commits ride along and appear in
the changelog the next time a `feat`/`fix` does land.

`conventional-changelog-conventionalcommits` is pinned to `^9.3.1`, not the latest `10.x`, found
during dry-run verification: v10 rewrote its templates from Handlebars strings to plain functions
using `@conventional-changelog/template`'s composable helpers, which is a different rendering
contract than `conventional-changelog-writer@8.x`'s Handlebars-partial-registration pipeline that
`@semantic-release/release-notes-generator` still relies on. With v10, `headerPartial` happens to
render correctly (Handlebars calls partial functions with the root context as the first argument,
which coincidentally matches what a top-level partial expects), but `commitPartial` receives
`(commitObject, handlebarsOptions)` where the function expects `(rootContext, commit)` — the
arguments are effectively swapped, so every commit line silently renders as an empty string and
the changelog body is dropped entirely with no error. `.github/dependabot.yml` ignores major-version
updates for this package for the same reason ADR #10 ignores TypeScript majors — verify
`commitPartial` output manually (`npx semantic-release --dry-run --no-ci`) before ever bumping it.
