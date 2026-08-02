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

---

## 12. Content authoring: `@astrojs/mdx` alongside plain Markdown

**Status:** Accepted — 2026-08-01

**Context:** Case studies had outgrown plain prose. The Ocho entry described a four-state color
system entirely in words — the one kind of content that should be shown rather than told — and
there was no way to put a color swatch, a captioned figure, or any component into a content
entry. Three options were considered. Raw HTML inside `.md` works today but puts inline styles and
unscoped class names into content files, where Tailwind's scanner can't see them and no type
checking applies. A frontmatter-driven media array (schema-validated, rendered by
`src/pages/projects/[id].astro`) keeps content clean but can only place figures around the prose,
not at the point in the argument where the evidence belongs. MDX allows components inline at the
exact position they're being cited.

**Decision:** Install `@astrojs/mdx` and register it in `astro.config.mjs`. Both collections in
`src/content.config.ts` already glob `**/[^_]*.{md,mdx}`, so no schema or loader change was needed;
the loader had anticipated MDX from the start. `.mdx` is the format for all entries in both
collections rather than a per-entry opt-in, so there is one authoring path to learn and no
judgment call about when an entry has earned the upgrade. Components intended for content live in
`src/components/content/` (`Figure.astro`, `Swatch.astro`), separate from `src/components/ui/`
primitives, so it's clear which are safe to reference from an entry.

**Consequences:** MDX compiles at build time and ships no client JS, so the Lighthouse
`resource-summary:script:size` budget (30 KB) is unaffected. Prettier formats `.mdx` with its
built-in parser; no plugin needed. The cost is that MDX is stricter than Markdown about raw HTML
and unescaped `{` and `<` outside code fences, which is the usual cause when an entry fails to
build. `generate-assets.js` filters content files by extension independently of the loader, so its
filter has to track this glob or an entry silently ships without an OG image.

---

## 13. Canonical origin: `danielkindl.dev`, not the `github.io` subdomain

**Status:** Accepted — 2026-08-01

**Context:** The site was published at `daniel-kindl.github.io`, a hostname owned by the platform
rather than by me. Hosting stays on GitHub Pages, but a project's public address shouldn't be
something a hosting change would invalidate, and `github.io` reads as a staging URL on a CV.

**Decision:** Serve the site from `danielkindl.dev`, configured as the GitHub Pages custom domain
with HTTPS enforced. The domain is the canonical origin everywhere it's stated: `site` in
`astro.config.mjs` (which is what `@astrojs/sitemap`, `@astrojs/rss`, and every absolute canonical
and OG URL in `Layout.astro` derive from), `Host`/`Sitemap` in `public/robots.txt`, the README, and
the `links.production` field of the portfolio case study. Repository URLs still point at
`github.com/daniel-kindl/daniel-kindl.github.io`, because that's the repository's actual name.

**Consequences:** `site` in `astro.config.mjs` is the single value that has to change if the domain
ever moves again; everything else derives from it, so getting it wrong silently publishes a sitemap
and OG tags advertising the wrong origin. The old `github.io` URLs keep working, since GitHub Pages
redirects them to the custom domain, so previously indexed links don't break. The custom domain
lives in the repository's Pages settings rather than a committed `public/CNAME` file; adding the
file would make it survive a settings reset, at the cost of a second place to keep in sync.

This entry also supersedes one detail in ADR #11: `src/lib/buildInfo.ts` no longer embeds the
commit hash, only `pkg.version`. The hash was noise for visitors, and dropping it removed a
`git rev-parse` shell-out from the build.

---

## 14. Content commits: a repo-specific `content:` type, outside the release rules

**Status:** Accepted — 2026-08-02

**Context:** Every content entry added so far was committed as `feat:` (`feat: add blog post about
homelab setup`, `feat: publish post on the AI-assisted development workflow behind this site`,
`feat: add DK Timer project case study`). Since ADR #11, `feat:` means a minor version bump, so
publishing a blog post moved the version displayed in the footer and cut a GitHub Release. That
conflates two different things: the version identifies the _site_ — its components, build, and
tooling — while entries under `src/content/` are what the site publishes. A new post is not a new
version of the software any more than a new article is a new version of a newspaper's printing
press.

**Decision:** Add a repo-specific `content` type for anything under `src/content/`. It is registered
in two places: `commitlint.config.mjs` overrides `type-enum` with `@commitlint/config-conventional`'s
default list plus `content`, and `release.config.mjs` adds `{ type: 'content', section: 'Content' }`
to the `release-notes-generator` preset config so it gets its own changelog section.
`@semantic-release/commit-analyzer` is deliberately left alone: its `conventionalcommits` release
rules only bump for `feat`, `fix`, `perf`, `revert`, and breaking changes, so an unrecognized type
produces no release by default. This is the same mechanism ADR #11 already relies on for `chore`,
not a special-cased override. `feat:`/`fix:` stay reserved for the site itself, including changes to
the components and schemas that _render_ content.

**Consequences:** Publishing is decoupled from versioning: a stretch of content-only commits
produces no release, no tag, and no version bump, and those commits ride along in the changelog
under "Content" the next time a `feat`/`fix` lands (identical to the chore behavior described in
ADR #11). The cost is that `content:` is not part of the Conventional Commits spec, so any tool
reading this history without `commitlint.config.mjs` sees an unknown type; the failure mode is
benign, since unknown types are ignored rather than misread. Historical `feat:` content commits are
left as they are, because rewriting published history to correct a convention is not worth the tag
churn.

## 15. Island framework: removing Svelte, superseding ADR #3

**Status:** Accepted — 2026-08-02 (supersedes #3)

**Context:** ADR #3 chose Svelte 5 via `@astrojs/svelte` for `src/components/islands/`. That
directory no longer exists, and neither does `src/components/playground/` — both were removed as
dead code once the placeholder components in them turned out to be unused. The repository contains
zero `.svelte` files. What remained was four installed packages (`@astrojs/svelte`, `svelte`,
`eslint-plugin-svelte`, `prettier-plugin-svelte`), a registered integration, a `svelte.config.js`,
and matching entries in the ESLint, Prettier and lint-staged configs — all serving nothing.

The dependency weight is not the argument. `production-portfolio-system.mdx` states in production
that "every claim it makes about engineering discipline is checkable against the repository it ships
from." README, `AGENTS.md` and `colophon.astro` all advertised "Svelte 5 islands." On a site whose
own case study invites that check, an unbacked stack claim is a content defect, not a docs nit.

**Decision:** Remove the integration and all four packages, delete `svelte.config.js`, drop the
Svelte cases from `eslint.config.mjs`, `.prettierrc.json` and `.lintstagedrc.json`, and remove Svelte
from the colophon's stack list. `src/data/cv.ts` keeps Svelte: that is Daniel's personal skill
inventory, not a claim about this site's build.

ADR #3 is left intact rather than edited — it recorded a decision that was correct when made.

**Consequences:** There is no island framework installed. An interactive component now costs an
explicit `npx astro add svelte` first, which is a deliberate speed bump rather than a barrier; the
runes guidance in ADR #3 still applies whenever that happens. Verified by deleting `node_modules`
and running `npm ci` followed by generate-assets, lint, format:check, typecheck, test and build —
proving nothing depended on Svelte resolving transitively.
