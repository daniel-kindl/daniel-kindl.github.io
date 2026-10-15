#!/usr/bin/env bash
# One entry point for local and CI verification: install, check, build.
# Fails on any error and on any lint, type-check, or Astro build warning.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -n "${CI:-}" || ! -d node_modules ]]; then
  echo "==> npm ci"
  npm ci
fi

log="$(mktemp)"
trap 'rm -f "$log"' EXIT

echo "==> lint"
npm run lint

echo "==> format check"
npm run format:check

echo "==> type check"
npm run typecheck 2>&1 | tee "$log"
if grep -Eq -- '- [1-9][0-9]* (warnings?|hints?)' "$log"; then
  echo "verify: astro check reported warnings or hints" >&2
  exit 1
fi

echo "==> tests"
npm test

echo "==> build"
npm run build 2>&1 | tee "$log"
if grep -Eq '\[WARN\]|\[warn\]' "$log"; then
  echo "verify: astro build reported warnings" >&2
  exit 1
fi

echo "==> built-site checks"
node --test "test/*.test.mjs"

echo "verify: OK"
