# Tech Decisions

Log of durable stack and tooling decisions. One entry per decision: **Status / Context /
Decision / Consequences.**

Add an entry only for a durable decision. A durable decision has one or more of these properties:

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

---

## 16. Deployment: no site version, superseding the release half of ADR #11 and #14

**Status:** Accepted — 2026-09-28 (supersedes the release automation in #11 and the version reason in #14)

**Context:** ADR #11, and the later dependency-free replacement in `scripts/release.mjs`, cut a
semantic version on every push to `master` that contained a `feat`, `fix`, `perf`, `revert`, or
breaking commit. That step rewrote `CHANGELOG.md`, `package.json`, and `package-lock.json`,
committed, tagged, opened a GitHub Release, and forced a second production build so the footer
could show the new version. ADR #14 added a `content:` commit type so a post would not move that
version. `SECURITY.md` already says only the revision on `master` is supported. A personal
portfolio has one deployed revision and no package consumers, so the version, the changelog, and
the second build recorded a release nobody installs.

**Decision:** Deploy builds once and publishes that output. It does not bump `package.json`,
rewrite a changelog, create a commit, create a tag, or open a GitHub Release. Remove
`scripts/release.mjs`, `scripts/release.test.mjs`, `scripts/changelog-bootstrap.mjs`,
`CHANGELOG.md`, and `src/lib/buildInfo.ts`. The footer no longer shows a version. Git history and
pull requests are the change record. `scripts/sync-mirror.ps1` mirrors `master` only.
Dependabot no longer ignores `conventional-changelog-conventionalcommits`.

Conventional Commits stay. ADR #6 uses them for commit discipline, not to calculate a version.
The `content:` type stays so a post or case study stays distinct from a change to the site.
`package.json` keeps its current `version` field as a static private-package field. Nothing in
the build reads it, and deploy does not write it. Existing git tags stay in place.

ADR #11 and ADR #14 are left intact. They record decisions that were correct when made.

**Consequences:** A push to `master` publishes the commit that passed the gates. A content-only
commit and a site commit take the same deploy path. The deploy token needs `contents: read`,
`pages: write`, and `id-token: write`. It no longer needs permission to push.

---

## 17. Local checks: `npm run check`, no Git hooks

**Status:** Accepted — 2026-09-28 (supersedes the hook enforcement in #6; narrows the commit-format sentence in #16)

**Context:** ADR #6 installed Husky, commitlint, and lint-staged so every commit used a
Conventional Commits subject and so staged files passed ESLint and Prettier. ADR #11 used that
subject to calculate a version. ADR #16 removed the version step and kept the subject format as
discipline. The hooks, `commitlint.config.mjs`, and the `lint-pr-title` job
(`amannn/action-semantic-pull-request`) still rejected a subject that did not match. CI on every
pull request to `master` already runs ESLint, Prettier, the Astro type check, the tests, and the
production build. The local hook repeated the source checks and stopped the commit before CI could
report the same result. The subject format no longer changes a version, a changelog, or a tag.

**Decision:** Remove Husky, `@commitlint/cli`, `@commitlint/config-conventional`, lint-staged,
`commitlint.config.mjs`, `.lintstagedrc.json`, and the `commit-msg` and `pre-commit` hooks. Remove
the `lint-pr-title` job. `npm run check` runs lint, the format check, the type check, and the
tests. CI and deploy run `npm run check` in place of those four steps. Asset generation, the
dependency audit, the production build, and the Lighthouse budget stay as their own steps.

A commit subject stays a writing convention: one line, `type: description`, `content:` for a change
under `src/content/`, and `feat:` or `fix:` for a change to the site. No hook and no workflow
rejects a subject.

**Consequences:** `npm install` does not install Git hooks. Run `npm run check` before a pull
request. CI is the gate on `master`. A subject that skips the type prefix can land. History before
this ADR keeps its old subjects. ADR #6 and ADR #16 stay as written.

---

## 18. Pull-request CI checks; deploy publishes

**Status:** Accepted — 2026-09-28 (narrows the CI and deploy sentence in #17)

**Context:** After #16 and #17, a pull request and a push to `master` still did the same work.
Each run installed dependencies, ran `npm audit --audit-level=high`, generated assets, ran
`npm run check`, built the site, and ran Lighthouse CI. Lighthouse collected three runs of the
five URLs in `lighthouserc.json`. Deploy repeated that work and then published the site. The
release step, the full git history, and the pull-request title check are already gone. Checkout
uses the default fetch depth. The deploy token already has only `contents: read`, `pages: write`,
and `id-token: write`.

**Decision:** A pull request to `master` runs `npm ci`, `npm run check`, and `npm run build`.
That is the merge gate. `npm run check` is lint, the format check, the type check, and the tests.

A push to `master`, or a manual run of the deploy workflow, installs dependencies, runs
`npm run generate-assets`, builds once, and deploys that output to GitHub Pages. Deploy does not
run `npm run check`, `npm audit`, or Lighthouse.

Neither workflow runs `npm audit`. Dependabot opens the weekly dependency updates. An advisory
in the registry does not fail an unrelated pull request.

Lighthouse moves to `.github/workflows/lighthouse.yml`. A push to `master`, or a manual run,
generates assets, builds, and collects one run of the same five URLs. The assertions stay. The
workflow does not run on a pull request, and a failure does not stop the Pages deploy. Three runs
smooth score variance. One run still fails a broken page, a script over 30 KB, a font over 96 KB,
or a category score under its minimum. If one run fails and a repeat passes, raise `numberOfRuns`
in that workflow only.

Concurrency stays split. Pull-request CI cancels an older run on the same ref. Deploy uses the
`pages` group and does not cancel an in-progress publish. Lighthouse uses its own group, cancels
an older run on the same ref, and does not share the deploy group. The Lighthouse job can upload
a report, so its token also has `actions: write`.

**Consequences:** A pull request can merge while Lighthouse is red on an earlier commit. The next
push to `master` measures the new site. The pull-request build does not generate images. Deploy
generates them before the published build. Run `npm audit` locally when you want that report.
ADR #17 stays as written.

---

## 19. Committed icons and one share image

**Status:** Accepted — 2026-09-28 (retires the per-entry image step described in #12 and #18)

**Context:** `generate-assets.js` used the `canvas` package to draw icons, a default Open Graph
image, and one Open Graph image per project and writing entry. `canvas` is a native module. A fresh
machine needed Cairo and Pango before `npm install` could finish. Deploy and the Lighthouse
workflow ran the script because those PNG files were gitignored. The per-entry image showed the
entry title on a dark card. `og:title` and `og:description` already carry that title and the
summary. A replacement rasterizer (WASM or another native binding) would keep a generator, a font,
and a second copy of the content-file rules.

**Decision:** Remove `canvas`, `generate-assets.js`, and the `generate-assets` script. Commit
`public/icon.svg`, `public/apple-touch-icon.png`, `public/assets/meta/icon-192.png`,
`public/assets/meta/icon-512.png`, and `public/assets/meta/og-default.png`. Every page uses
`/assets/meta/og-default.png` unless the page passes `ogImage`. Deploy and Lighthouse no longer
generate images. They install dependencies and build.

**Consequences:** A social card shows the site image plus the page title and description. A new
entry does not need an image step. `npm install` does not build a native graphics module. ADR #12
and ADR #18 stay as written. The sentence in #12 that keeps `generate-assets.js` in step with the
content glob no longer applies. The deploy sentence in #18 that runs `npm run generate-assets` no
longer applies.

---

## 20. One verify script for CI and deploy, narrowing ADR #18

**Status:** Accepted — 2026-10-15 (narrows the CI and deploy decision in #18)

**Context:** ADR #18 had pull-request CI run `npm ci`, `npm run check`, and `npm run build`, and
had deploy build without `npm run check`. It also named `npm run generate-assets`, which ADR #19
removed. Local runs and the two workflows each listed their own steps. Lint warnings, `astro check`
warnings, and Astro build warnings did not fail any of them.

**Decision:** `./eng/verify.sh` is the one local and CI entry point. It runs `npm ci` in CI or
when `node_modules` is missing, then lint, the format check, the type check, the tests, and the
production build. A lint warning, an `astro check` warning or hint, or an Astro build warning
fails the script. Pull-request CI and deploy both run it. Deploy publishes the `dist/` that the
script built.

**Consequences:** Deploy now runs the full source checks before it publishes, so a red check on
`master` stops a publish. A deploy takes slightly longer. The rest of ADR #18 (no `npm audit`,
concurrency groups, Lighthouse in its own workflow) is unchanged. ADR #18 stays as written.

---

## 21. Lighthouse on pull requests as a merge gate

**Status:** Accepted — 2026-10-15 (narrows the Lighthouse paragraph in #18)

**Context:** ADR #18 ran Lighthouse only on a push to `master`, so a pull request could merge while
the budget was red. The budget catches a script over 30 KB, a font over 96 KB, and a category score
under its minimum, and those are cheapest to fix before merge.

**Decision:** `.github/workflows/lighthouse.yml` also runs on a pull request to `master`. The job
name stays `lighthouse`, and the protect-master ruleset requires that check. `lighthouserc.json` is
unchanged: one run of the same five URLs with the same assertions.

**Consequences:** A pull request that breaks a budget cannot merge. One run can be noisy. If a
pull request fails and a re-run passes, raise `numberOfRuns` as ADR #18 says, not the thresholds.
The run on `master` stays and still does not block the deploy. ADR #18 stays as written.

---

## 22. Pull-request title check, updating ADR #17

**Status:** Accepted — 2026-10-15 (updates the "no workflow rejects a subject" sentence in #17)

**Context:** ADR #17 removed Husky, commitlint, and the `lint-pr-title` job, so nothing checks a
subject. The protect-master ruleset allows only squash merges, and the squash commit takes the
pull-request title. A title that skips the type prefix lands on `master` as is.

**Decision:** Add `.github/workflows/pr-title.yml` with one job, `pr-title`. It runs on a pull
request to `master` (opened, edited, reopened, synchronize), reads the title through an environment
variable, and matches it with a Bash regex: `type(scope)?!?: description`, no trailing period.
Types: `feat`, `fix`, `content`, `docs`, `chore`, `test`, `refactor`, `perf`, `ci`, `build`,
`style`, `revert`. The job has no token permissions, no checkout, no third-party action, and no
npm dependency. The protect-master ruleset requires `pr-title`. A pull-request template reminds
the author of the format.

**Consequences:** `master` history stays conventional through squash merges. Local commits on a
branch are still free-form, and Git hooks stay out (the rest of ADR #17 holds). Dependabot titles
(`chore: bump ...`) already match. ADR #17 stays as written.

---

## 23. Retire the OneDev mirror

**Status:** Accepted — 2026-10-15 (retires the OneDev mirror mentioned in #6, #11, and #16)

**Context:** `scripts/sync-mirror.ps1` fast-forwarded `master` from GitHub to a local OneDev
remote through a Windows scheduled task on one machine. That mirror is no longer in use. GitHub is
the only remote: issues, pull requests, the protect-master ruleset, CI, and Pages all live there.
The colophon page still told visitors the repository had two remotes.

**Decision:** Remove `scripts/sync-mirror.ps1` and the OneDev mirror sections in `AGENTS.md` and
`README.md`. The colophon names GitHub as the only remote. GitHub `master` is the single source of
truth.

**Consequences:** No script, repository document, or colophon text describes a OneDev remote, the
`hosting` remote name, or the `PortfolioSiteMirrorSync` task. OneDev mentions in `src/data/cv.ts`
and `src/content/writing/started-homelab.mdx` describe Daniel's homelab and skills, not this
repository, and stay as history. Delete that scheduled task on the Windows machine if it still
exists. Earlier ADRs that mention OneDev stay as written.

---

## 24. Cloudflare in front of GitHub Pages: headers, no CSP, rollback

**Status:** Accepted, 2026-10-23 (adds to #13 and #16)

**Context:** GitHub Pages hosts the site. The domain `danielkindl.dev` is on Cloudflare. The name
servers and the apex records are Cloudflare's, and live responses carry `server: cloudflare`. No
file, document, or earlier ADR said so. Four facts follow from this layer:

- GitHub Pages cannot set response headers. On 2026-10-23 the live site sent no
  `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy`, or `Permissions-Policy` header.
- Cloudflare can change the live HTML. With Email Address Obfuscation on, it added an
  `email-decode` script. It also rewrote the `mailto:` links in the footer and on the home page to
  `/cdn-cgi/l/email-protection` links that need JavaScript. CI tests `dist/`, not the live HTML,
  so it cannot see this. The address is public in `src/lib/siteConfig.ts`, so the rewrite
  protects nothing.
- Cloudflare Web Analytics runs on the live site. Cloudflare injects a script from
  `static.cloudflareinsights.com` (with a `data-cf-beacon` attribute) at the edge. The page then
  sends a POST to `/cdn-cgi/rum`. The script is not in `src/` or `dist/`. A check of `dist/` or of
  the origin HTML does not show it. CI tests `dist/`, not the live HTML, so CI cannot see it.
- A strong Content Security Policy does not fit this site. Astro's `security.csp` option does not
  support `<ClientRouter />` or Shiki (Astro configuration reference, `security.csp`). The site
  uses both (`src/layouts/Layout.astro`, `astro.config.mjs`). The built pages have inline scripts,
  for example `ThemeScript.astro`, and Shiki writes inline styles.

**Decision:**

1. Cloudflare is part of the hosting. Its settings live in the Cloudflare dashboard, not in this
   repository. These settings are the intended state:
   - SSL/TLS mode: Full. On 2026-10-23 the mode was changed from Full (strict) to Full as a
     safety net. The GitHub Pages certificate stayed in the `bad_authz` state after the custom
     domain was removed and added again. Return to Full (strict) after GitHub approves the
     Pages certificate, and record that in a new ADR entry. Never use Flexible: it loops when
     HTTPS is enforced. - Web Analytics: on, with automatic installation. Daniel chose to keep it on 2026-10-23. The
     site has one third-party script, and it comes from Cloudflare.
   - Email Address Obfuscation: off. The `mailto:` links work without JavaScript.
   - Always Use HTTPS: on. Minimum TLS version: 1.2.
   - `X-Content-Type-Options: nosniff`: on, through the No-Sniff option in the HSTS panel of the
     dashboard, with HSTS itself off.
   - One response-header rule for all paths of `danielkindl.dev`. It sets
     `Referrer-Policy: strict-origin-when-cross-origin`,
     `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and
     `Strict-Transport-Security`.
   - The HSTS setting in the Cloudflare dashboard stays off. Only the header rule sends HSTS, so
     one place holds the value.
   - The HSTS rule starts with `max-age=86400`, and only after the certificate state is fixed.
     After one week without a problem, raise it to `max-age=15552000` (6 months). This raise is a
     planned step of this decision, so it needs no new ADR entry. Do not add `includeSubDomains`
     or `preload`.
2. Add no Content Security Policy. A policy with `'unsafe-inline'` gives little protection. A policy built on hashes breaks when Astro or Shiki changes its inline output. Both kinds of policy also need an allow rule for the beacon host and for `/cdn-cgi/rum`. The site has no
   server-side input and no login. The only third-party script is the Cloudflare beacon. The attack surface is small. The only
   input is the search box, and Pagefind runs in the browser. Add no frame-protection header for
   the same reason. No page has an action that a frame can trick a visitor into.
3. Rollback:
   - Bad content or code: open a revert pull request. The required checks run. A squash merge
     deploys the revert in about 40 seconds. A re-run of an old `Production Deployment` run is
     another option, but it is not tested.
   - Bad header rule or setting: disable the rule or restore the setting in the Cloudflare
     dashboard. A browser keeps an HSTS value until its `max-age` ends. The staged `max-age` limits
     that damage. If the dashboard is down, no header change is possible until it returns.
   - Bad proxy state: set the DNS records to "DNS only" in Cloudflare. The site then serves from
     GitHub Pages without the header rule. This step needs a valid Pages certificate, and it is
     not tested. With HSTS on and a bad certificate, browsers show a hard error.

**Consequences:** Cloudflare changes are manual, and no pull request reviews them. This ADR is the
record of the intended settings. Any change other than the planned HSTS raise needs a new ADR
entry. The difference between this record and the live site is the drift risk. A check of the live
headers after deploy is possible, but it is not needed now. The site has no CSP, and a scanner will
report that. Add a CSP if the site gets server-side input, a login, or a third-party script other than the Cloudflare beacon. Add
one also if Astro supports both `<ClientRouter />` and Shiki in `security.csp`. A header rule in Cloudflare is not
part of `dist/`. A move to another host needs the same headers set there.

---

## 25. Node range below 25 and required action pinning, updating ADR #1

**Status:** Accepted, 2026-10-23 (updates the `engines.node` value in #1)

**Context:** ADR #1 set `engines.node` to `">=24.0.0"`. That range has no upper bound, so a Node
major version that the project does not test would satisfy it. `.nvmrc` and every workflow use
Node 24. Separately, all 10 `uses:` lines in the workflow files pin an action to a full commit
SHA, and Dependabot has a `github-actions` entry that updates the pins.

**Decision:** `package.json` and `package-lock.json` set `engines.node` to `">=24.0.0 <25"`.
`.nvmrc` (`24`) and each `node-version` in the workflows stay at `24`.
`test/node-version.test.mjs` checks that they agree with the range. The repo setting
`sha_pinning_required` is on. It is a repo setting, not a file, and it was set through the GitHub
Actions permissions API.

**Consequences:** A change to Node 25 in `.nvmrc` or in a workflow fails the test until the range
changes on purpose. A workflow that uses an action without a full commit SHA fails when it runs.
Each new action needs a full commit SHA. The rest of ADR #1 (Node 24 LTS, `.nvmrc`, when to
revisit) holds. ADR #1 stays as written.
