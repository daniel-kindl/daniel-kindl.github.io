---
title: 'DK Timer'
summary: 'Minimal, drift-free EMOM and Tabata workout interval timer for Android, built with Kotlin and Jetpack Compose.'
role: 'Solo Developer'
stack: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Android']
links:
  repository: 'https://github.com/daniel-kindl/dk-timer'
  release: 'https://github.com/daniel-kindl/dk-timer/releases/tag/v2.2.0'
status: 'maintaining'
dates:
  start: 2026-05-05
  end: null
weight: 9
---

## Context

Built for reliability during physical exercise: a minimal, single-purpose workout interval timer for EMOM and Tabata sessions, rather than a general-purpose fitness app with a timer bolted on.

## What I delivered

- Kotlin + Jetpack Compose UI on Material 3, with Hilt for dependency injection and a clean-architecture split across `domain`, `data`, and `ui` layers.
- A drift-free timer engine: every interval boundary is anchored to `startTime + N × intervalMillis` and recalculated on each tick, instead of accumulating error through a naive `sleep` loop. Pause/resume works the same way, accumulating total paused duration and subtracting it from elapsed time (`effectiveElapsed = now - startTime - totalPausedMs`), so accuracy holds across any number of pauses.
- DataStore-backed presets for both timer types, sound feedback on the alarm stream (so it ignores silent mode) and vibration feedback, each independently toggleable.
- Static analysis (detekt) and unit tests running in CI.

## Outcome

Shipped and actively maintained, with four tagged releases from `v1.0.0` through `v2.2.0`.
