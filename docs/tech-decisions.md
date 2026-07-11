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

# Epic 0 — Setup & Tooling: Completion Summary

All nine issues in Epic 0 are closed. What exists now:

| #   | Issue                                     | Outcome                                                                          |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Decide final stack versions               | This document                                                                    |
| 2   | Initialize fresh Astro project            | `npm create astro@latest`, strict TypeScript                                     |
| 3   | Configure local + GitHub remotes          | `origin` (GitHub) + `local` (OneDev) push independently                          |
| 4   | `.gitignore` + `.editorconfig`            | Extended Astro's default `.gitignore`; UTF-8/LF/2-space `.editorconfig`          |
| 5   | ESLint + Prettier                         | Flat config (`eslint.config.mjs`), Astro/TS/Svelte-aware, Tailwind class sorting |
| 6   | Commit convention                         | Husky pre-commit (lint-staged) + commit-msg (commitlint, Conventional Commits)   |
| 7   | `tsconfig.json` strictness + path aliases | Strict mode inherited from Astro; `@components/*` etc. aliases, no `baseUrl`     |
| 8   | `.nvmrc` + local dev doc                  | Node 24 pinned; README documents setup, commands, and hook behavior              |
| —   | README                                    | Stack overview, folder structure, commands table, tooling notes                  |

**Verified working end-to-end:**

- `npm run lint` — clean
- `npm run format:check` — clean
- `npm run typecheck` — 0 errors, 0 warnings, 0 hints
- A non-conventional commit message is correctly rejected by commitlint
- A conventional commit message runs lint-staged, then succeeds
