---
title: 'Avoiding Unnecessary Hashing: A Tiered Comparison Strategy for Directory Sync'
summary: 'Why comparing two directories efficiently means avoiding SHA-256 hashing whenever possible, and how a three-tier check (size, timestamp, hash) gets you both speed and correctness.'
date: 2026-07-12
tags: ['C#', '.NET', 'File Systems', 'Performance']
draft: false
project: directory-sync-tool
---

## The problem

Reliably mirroring one directory to another means answering one question, over and over, for every file: _has this changed?_

The naive answer is to hash both files and compare. It's also the slowest possible answer. Hashing every file on every sync run means reading the full contents of every file, every time. For a directory with gigabytes of mostly-unchanged data, that's a lot of wasted disk I/O for files that didn't change at all.

## Three tiers, cheapest first

The approach I used in `dirsync` is a tiered comparison: check the cheap signals first, and only fall back to the expensive one when the cheap signals are ambiguous.

**Tier 1: file size.** If the source and replica file sizes differ, the file changed. Full stop. No further checks needed. This alone eliminates the vast majority of unchanged files in a typical sync, at the cost of a filesystem stat call.

**Tier 2: last-write timestamp.** If sizes match, compare `LastWriteTimeUtc` within a tolerance window (2 seconds by default, to accommodate filesystems like FAT32 that don't store sub-second precision). If the timestamp is unchanged, the file is treated as unchanged.

**Tier 3: SHA-256 hash.** Only when size and timestamp both fail to rule out a change does the tool fall back to hashing. This is the expensive, but authoritative, check.

Roughly:

```csharp
bool HasChanged(FileInfo source, FileInfo replica)
{
    if (source.Length != replica.Length)
        return true;

    if (!TimestampsMatch(source, replica, tolerance: TimeSpan.FromSeconds(2)))
        return true;

    // Only now pay for a full read + hash
    return ComputeSha256(source) != ComputeSha256(replica);
}
```

## Why tiering matters here specifically

The tradeoff is honesty about what each tier can and can't guarantee. Size and timestamp checks are fast but not cryptographically reliable: it's possible, in principle, for a file to change without its size or timestamp changing (a tool that rewrites a file in place with identical byte count and manually preserved timestamp, for instance). That's an accepted tradeoff for the `sync`/`daemon` commands, where speed matters and the odds of that edge case are low.

For cases where correctness has to be certain (the `verify` command), the tool skips the fast tiers entirely and always hashes. Different commands get different tradeoffs, but the underlying comparison logic stays the same.

## Beyond comparison: making the copy itself safe

Knowing a file changed is only half the problem. Copying it safely is the other half. If a sync process is killed mid-copy (power loss, Ctrl+C, an OOM kill), a half-written file left in the replica is worse than no file at all, because now the replica looks up to date when it isn't.

The fix is an atomic copy: write to a temporary file (`.tmp.{guid}`) alongside the destination, then move it into place. A move within the same volume is effectively instantaneous and atomic at the filesystem level: the replica either has the old file or the fully-written new one, never something in between.

## Takeaway

None of these ideas are novel on their own. Tiered comparison and atomic writes are well-known patterns. What made the difference for me was being deliberate about _which_ command gets which tradeoff, rather than picking one comparison strategy and using it everywhere. A backup daemon that runs every few minutes and a one-off verification check have different tolerances for risk, and the tool should reflect that rather than force a single compromise.
