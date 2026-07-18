---
title: 'Directory Synchronization Tool (dirsync)'
summary: 'Cross-platform CLI utility in C#/.NET for one-way directory synchronization, with SHA-256 change detection, atomic file operations, and safety rails against path traversal and data loss.'
role: 'Solo Developer'
stack: ['C#', '.NET 10', 'xUnit', 'GitHub Actions']
links:
  repository: 'https://github.com/daniel-kindl/directory-sync'
  release: 'https://github.com/daniel-kindl/directory-sync/releases/tag/v1.0.0'
status: 'finished'
dates:
  start: 2025-09-12
  end: 2025-12-21
weight: 8
---

## Context

The initial prototype started as a take-home technical assessment during a job interview process. The problem itself, reliably mirroring a source directory to a replica, was compelling enough that I continued developing it into a fully-featured, production-quality tool after the interview.

## What I delivered

- Built a tiered comparison engine (size → timestamp → SHA-256 hash) to minimize unnecessary hashing while guaranteeing accurate change detection.
- Implemented atomic file operations (temp file + move) and retry logic with exponential backoff to prevent corruption from interrupted or transient failures.
- Added path traversal protection, symbolic link rejection, and disk space validation as safety rails before any destructive operation.
- Shipped with 42 passing unit tests, multi-platform CI/CD (Ubuntu/Windows/macOS), CodeQL security scanning, and single-file release binaries for four platforms.

## Outcome

Released as v1.0.0 with global .NET tool installation support (`dotnet tool install --global DirectorySync.Cli`) and pre-built binaries for Windows, Linux, and macOS.
