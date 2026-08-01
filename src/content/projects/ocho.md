---
title: 'Ocho'
summary: 'Minimal, drift-free EMOM and Tabata interval timer for Android, with full-screen phase colors legible mid-effort and self-updating release channels outside Google Play.'
role: 'Solo Developer'
stack: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Android', 'GitHub Actions']
links:
  repository: 'https://github.com/daniel-kindl/ocho'
  release: 'https://github.com/daniel-kindl/ocho/releases/latest'
status: 'maintaining'
dates:
  start: 2026-05-05
  end: null
weight: 9
---

## Context

Built for reliability during physical exercise: a minimal, single-purpose workout interval timer for EMOM and Tabata sessions, rather than a general-purpose fitness app with a timer bolted on. The constraint driving every design decision is that you are mid-effort and usually not looking at the screen.

The name fits the same brief. An _ocho_ is a figure-eight step in tango, and it is Spanish for _eight_ — the round count of a classic Tabata.

## What I delivered

- Kotlin + Jetpack Compose UI on Material 3, with Hilt for dependency injection and a clean-architecture split across `domain`, `data`, and `ui` layers. The domain layer carries no `android.*` imports, which is what makes the timing logic testable without an emulator.
- A drift-free timer engine: every interval boundary is anchored to `startTime + N × intervalMillis` and recalculated on each tick, instead of accumulating error through a naive `sleep` loop. Pause/resume works the same way, accumulating total paused duration and subtracting it from elapsed time (`effectiveElapsed = now - startTime - totalPausedMs`), so accuracy holds across any number of pauses.
- A phase color system that treats the background as the primary information channel rather than decoration: one full-bleed plate per state — prepare amber, work red, rest light green, complete violet. Rest is a _light_ plate deliberately, because red and mid-green sit at nearly the same lightness and collapse into two indistinguishable mid-tones under deuteranopia. Separating them by lightness as well as hue keeps the signal readable with no color vision at all, and flips the on-plate text from white to ink as a second, redundant cue. Phase is never carried by color alone — plate, uppercase label, audio tone, and haptic all say the same thing — and Material You dynamic color is disabled so that work is red on every device.
- Self-updating distribution outside Google Play: an in-app checker against the GitHub Releases API that downloads and installs through `DownloadManager` and `PackageInstaller`. Stable and dev channels ship as separate `applicationId`s with separate data, so a dev build installs alongside the stable one and neither offers the other's updates.
- DataStore-backed presets for both timer types, sound feedback on the alarm stream (so it ignores silent mode) and vibration feedback, each independently toggleable.
- Build discipline enforced rather than documented: Kotlin, detekt, and Android Lint all run with warnings-as-errors, every public declaration in `src/main` requires KDoc, and unit tests plus static analysis gate CI on both `dev` and `main`.

## Outcome

Nine tagged releases so far, from `v1.0.0` through `v3.0.0` — the last of which carried the rebrand from DK Timer to Ocho, a documented design system, and GPL-3.0 licensing with a dual-licensing provision. I still actively develop and maintain it, with dev prereleases cut on every push to `dev` and stable builds tagged off `main`.
