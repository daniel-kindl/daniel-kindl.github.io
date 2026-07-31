---
name: Daniel Kindl Portfolio
description: A terminal/build-log aesthetic portfolio — bracketed mono status labels, hairline borders, zero shadows, one rare accent.
colors:
  paper: '#faf9f6'
  ink: '#1a1a1a'
  graphite: '#666666'
  hairline: '#e5e5e5'
  void: '#0a0a0a'
  bone: '#f5f5f5'
  ash: '#a0a0a0'
  hairline-dark: '#262626'
  terminal-green: '#10b981'
typography:
  display:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.25rem, 3vw, 3.75rem)'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.025em'
  body:
    fontFamily: 'IBM Plex Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: '0.05em'
  mono:
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: '-0.025em'
  meta:
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    fontSize: '0.625rem'
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: '-0.025em'
rounded:
  none: '0px'
  dot: '9999px'
spacing:
  sm: '0.5rem'
  md: '1rem'
  lg: '1.5rem'
  section: '5rem'
components:
  button-primary:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.mono}'
    rounded: '{rounded.none}'
    padding: '8px 16px'
    height: '44px'
  button-primary-hover:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.graphite}'
    typography: '{typography.mono}'
    rounded: '{rounded.none}'
    padding: '8px 16px'
    height: '44px'
  button-secondary-hover:
    textColor: '{colors.ink}'
  tag:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.graphite}'
    typography: '{typography.mono}'
    rounded: '{rounded.none}'
    padding: '4px 10px'
    height: '24px'
  tag-hover:
    textColor: '{colors.ink}'
---

# Design System: Daniel Kindl Portfolio

## Overview

**Creative North Star: "The Build Log"**

This is a CI console rendered as a portfolio: every surface reads like the terminal output of a
well-run engineering pipeline rather than a designed brochure. Status labels sit in literal square
brackets (`[SKIP_TO_CONTENT]`, `[Copy]`, `[Light]`/`[Dark]`). Sections are separated by hairline
rules, not cards or shadows. Type is either a bold geometric display face for structure or a
monospace face for anything that reads as system state, metadata, or a control. The overall effect
is restrained, precise, and quietly confident — the site's own construction is evidence for the
"production discipline over flash" claim it makes about its author.

Anti-reference: generic glossy SaaS marketing — soft gradients, bubbly rounded cards, friendly
illustration, drop shadows implying elevation. None of that vocabulary belongs here. Decoration is
rejected in favor of legibility and evidence.

**Key Characteristics:**

- Bracketed mono status labels as the system's one recurring signature motif
- Zero border-radius outside a single 8px timeline dot; zero box-shadow anywhere
- All separation done with 1px hairline borders (bottom rules and vertical rails), never a filled
  card surface distinct from the page background
- One accent color, used only at interaction/focus moments, never decoratively
- Two-register typography: Space Grotesk for structure (headings, eyebrows), JetBrains Mono for
  system/control chrome (nav, buttons, tags, metadata), IBM Plex Sans for reading body copy

## Colors

Palette character: near-monochrome paper/ink with a single rare accent; every neutral has a
confirmed light and dark counterpart via `data-theme`.

### Primary

- **Ink** (`#1a1a1a` light / `#f5f5f5` dark, token `ink`/`bone`): primary text color and the
  "inverted" fill buttons use on hover. Carries all high-emphasis content and the active/inverted
  state of controls.

### Neutral

- **Paper** (`#faf9f6` light / `#0a0a0a` dark, token `paper`/`void`): page background in both
  themes — warm off-white in light mode, near-black (not pure black) in dark mode.
- **Graphite** (`#666666` light / `#a0a0a0` dark, token `graphite`/`ash`): muted text — captions,
  eyebrows, secondary button labels, metadata.
- **Hairline** (`#e5e5e5` light / `#262626` dark, token `hairline`/`hairline-dark`): the only
  border color in the system. Used for every divider, rail, tag outline, and card boundary.

### Named Rules

**The Hairline Rule.** Depth and separation are always a single 1px border in the hairline token,
never a shadow and never a card background distinct from the page. If two regions need to be told
apart, draw a line between them; don't lift one off the page.

**The Rare Accent Rule.** Terminal Green (`#10b981`, token `terminal-green`, same value in both
themes) appears only at interaction and focus moments — text selection highlight, the skip-to-
content link, and one focus-visible ring on the code-copy control. It never fills a button, tag, or
decorative surface. Its rarity is what makes it register as a signal rather than a brand color.

## Typography

**Display Font:** Space Grotesk (with ui-sans-serif, system-ui fallback)
**Body Font:** IBM Plex Sans (with ui-sans-serif, system-ui fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas
fallback)

**Character:** Space Grotesk carries every heading and eyebrow label — bold, uppercase, tight
tracking, geometric and structural. JetBrains Mono carries anything that behaves like system
output: navigation, buttons, tags, dates, build metadata, bracketed status text. IBM Plex Sans is
reserved for actual reading — paragraph body copy only.

### Hierarchy

- **Display / Hero H1** (700, `clamp(2.25rem, 6vw, 3.75rem)` i.e. text-4xl→text-6xl, leading-none):
  the homepage hero headline only; the single largest, boldest moment on the site.
- **Headline / H1** (700, `1.875rem→2.25rem` i.e. text-3xl→text-4xl, tight leading): page titles.
- **Title / H2** (700, `1.25rem→1.5rem` i.e. text-xl→text-2xl): section headings.
- **Subtitle / H3** (700, `1rem→1.125rem` i.e. text-base→text-lg; `0.875rem` on Timeline events):
  card and sub-section headings.
- **Body** (400, `1rem`, line-height 1.625): paragraph copy; all headings and body share `text-
primary`/`ink`, body additionally uses `leading-relaxed` for long-form readability.
- **Eyebrow / Label** (400, `0.75rem`, `tracking-wider`, uppercase, `graphite`/muted): the small
  category tag above every section and card ("Project 01 · Role", "Selected Work").
- **Mono / Meta** (400, `0.75rem`–`0.625rem`, `tracking-tight`, uppercase where used): buttons
  (0.75rem), tags (0.625rem/10px), nav, footer, timeline dates (`tabular-nums`).

All heading variants (H1–H3) are uppercase with tight tracking by construction — there is no
sentence-case heading anywhere in the system.

### Named Rules

**The Bracket Label Rule.** A transient or system-state label — the skip link, the copy-code
button's idle/success/failure text, the theme toggle's current-mode label — is wrapped in literal
square brackets and set in mono type (`[SKIP_TO_CONTENT]`, `[Copy]` → `[Copied]`, `[Light]` /
`[Dark]`). Reserve brackets for these transient/utility states; permanent navigation labels and
body copy never take brackets.

## Layout

Single-column vertical rhythm: the whole site is a stack of full-bleed horizontal bands, each
separated by a hairline `border-b`, never a grid of floating cards. `Container` (`max-w-5xl`,
`px-4`/`md:px-8`) is the single owner of horizontal inset — `Header`, `Footer`, and page content all
render through it, so chrome and content always share the same left/right edge. The outer `<main>`
itself carries no width cap or padding of its own; it exists purely as the landmark and flex-grow
element.

Section rhythm is generous and consistent: `py-20` for major homepage/page sections, `py-12`–`py-
20` for page headers. The one deliberate exception to single-column stacking is the project case-
study row, which becomes a 12-column grid at `md:` (7/5 split, content first) and alternates left/
right order (zig-zag) by index — everything else, including writing posts and tags, stays single-
column full-width within its container.

Vertical rails (`border-l`) are used instead of side padding or backgrounds to indicate a
secondary/metadata column (the project card's status readout, the CV timeline).

## Elevation & Depth

Flat by current implementation: no `box-shadow` appears anywhere in the codebase. All depth and
grouping is conveyed through the Hairline Rule (borders) and whitespace/rhythm alone, never through
elevation. This is documented as the current state rather than a permanent prohibition — a future
surface may introduce restrained shadow use if a real need arises, but it isn't part of the system
today and shouldn't be reached for by default.

## Shapes

Sharp rectangles everywhere. Border-radius is effectively zero across the system — buttons, tags,
cards, inputs, and containers all have hard corners. The single exception is the ~8px filled circle
marking each Timeline event (`rounded-full`), which exists purely as a point-anchor glyph, not as
evidence of a rounded-corner language. Borders are always `1px` solid in the hairline token; they
serve double duty as dividers (`border-b`) and structural rails (`border-l`).

## Components

Component philosophy: **utilitarian and inevitable.** No control softens itself with rounding or
shadow — each one looks like the only reasonable way to build it, and borders plus mono labels do
all the communicative work.

### Buttons

- **Shape:** Sharp rectangle, no radius (`{rounded.none}`); `min-h-[44px] min-w-[44px]` touch
  target on every variant.
- **Primary:** `1px` border in graphite, `paper` background, `ink` text, mono uppercase 12px,
  `8px 16px` padding. Hover **inverts** fully — `ink` background, `paper` text — rather than
  tinting; this is a hard swap, not a lighten/darken.
- **Secondary:** No border, `graphite` (muted) text, `underline` with a hairline-colored underline.
  Hover un-mutes the text to `ink` and darkens the underline to match.
- **Hover / Focus:** All transitions are `150ms ease-out`. Focus-visible shows a `2px` outline in
  `ink`, offset `4px` (the general control focus ring); a small number of high-visibility controls
  (the skip link, the copy-code button) use the rare `terminal-green` accent for their focus
  treatment instead — see the Rare Accent Rule.

### Chips / Tags

- **Style:** Sharp rectangle, `1px` graphite border, `paper` background, `graphite` text, mono
  uppercase at `10px`, `min-h-[24px]`.
- **State:** When a tag is a link (e.g. a writing-post tag), hover inverts the border and text to
  full-strength `ink`; static tags (project stack badges) have no interactive state.

### Cards / Containers (Project Card — signature component)

- **Corner Style:** None; sharp rectangle.
- **Background:** Same as the page — no distinct card surface.
- **Shadow Strategy:** None (see Elevation & Depth).
- **Border:** `border-b` divider between entries; a `border-l` rail introduces the metadata column.
- **Internal Padding:** `pb-12` between entries; `gap-6` between the content and metadata columns.
- **Signature behavior:** desktop splits into a 7/5 grid — case-study content on one side, a
  mono-type metadata "readout" (Status / Timeline / Stack count) behind a `border-l` rail on the
  other — and alternates which side each is on by index (zig-zag), so the row never repeats the
  same layout twice in a row.

### Writing Post Card

- Simpler sibling of Project Card: no metadata rail, just a `border-b` divider, a muted mono
  meta-line (`date · reading time`), title, summary, tag row, and a secondary "Read Post →" button.

### Navigation (Header)

- **Style:** Single flat row, entirely in mono type, `text-xs`, `tracking-tight`, uppercase labels.
- **Default / Hover / Active:** Inactive links are `graphite`, hovering un-mutes to `ink`. The
  active route gets an `underline` in `ink` (via `aria-current="page"`), not a background or pill.
- **Wordmark:** Bold uppercase text only ("Daniel Kindl") — no logomark/icon — underlines on hover.
- **Divider glyph:** A literal `|` character separates the nav cluster from the theme toggle.
- **Mobile:** Wraps via flexbox (`flex-wrap`), no separate mobile nav/hamburger pattern.

### Timeline (CV/About — signature component)

- A `border-l` vertical rail with one small filled circle (`rounded-full`, the system's only
  rounded shape) per event, title left / date right (mono, `tabular-nums`, uppercase, wide
  tracking) on desktop, stacked on mobile.

## Do's and Don'ts

### Do:

- **Do** wrap transient system-state labels in literal square brackets and mono type (the Bracket
  Label Rule) — `[Copy]`, `[Copied]`, `[Light]`/`[Dark]`.
- **Do** separate every region with a single hairline border (bottom rule or left rail), never a
  card background or shadow.
- **Do** keep headings uppercase, bold, and tight-tracked in Space Grotesk; keep body copy in IBM
  Plex Sans at comfortable `leading-relaxed`.
- **Do** invert primary-button colors fully on hover (`ink`↔`paper`), not a partial tint.
- **Do** keep every interactive target at least `44×44px`.

### Don't:

- **Don't** add border-radius to buttons, tags, cards, or containers — sharp rectangles only,
  outside the one timeline dot.
- **Don't** introduce a box-shadow as a default pattern; the system currently has none, and any
  future use should be a deliberate, isolated exception, not a systemic elevation model.
- **Don't** use `terminal-green` decoratively (button fills, tag backgrounds, headings) — it's
  reserved for selection highlight and focus/interaction signals only.
- **Don't** use mono/bracket styling for permanent navigation labels or body copy — brackets signal
  "this is transient system state," not "this is a link."
