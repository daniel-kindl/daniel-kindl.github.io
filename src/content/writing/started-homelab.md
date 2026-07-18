---
title: 'Building Tangolab: Why I Finally Started a Homelab'
summary: 'Turning an old office PC into a self-hosted development lab for learning Linux, Docker, networking, backups, and infrastructure engineering.'
date: 2026-07-10
tags: ['Homelab', 'Linux', 'Docker', 'Self-Hosting', 'Infrastructure']
draft: false
---

## Why build a homelab?

For a long time, I wanted a place where I could experiment with technologies outside my day-to-day work without worrying about breaking anything important.

Cloud platforms are fantastic, but they abstract away much of the underlying infrastructure. I wanted to understand what actually happens underneath: installing an operating system, securing a server, managing containers, designing backups, and documenting everything well enough that I could rebuild it from scratch.

That's how **Tangolab** started: not as a production server or a cloud replacement, but as a personal laboratory I could break without consequence.

## Starting with what I already had

Rather than buying dedicated server hardware, I reused an old office PC that had been collecting dust under my desk.

Current hardware:

- Intel Core i3-3220
- 8 GB DDR3 RAM
- 500 GB HDD
- Gigabit Ethernet

By modern standards it's fairly modest hardware, and that's intentional.

Limited resources force better engineering decisions. Every running service has to justify the CPU time, memory, and storage it consumes. Instead of installing dozens of containers just because I can, I have to think carefully about what actually provides value.

## Design philosophy

Before installing anything, I wrote down a few principles I wanted to follow.

- Prefer free and open-source software.
- Keep the system lightweight.
- Expose nothing to the public Internet.
- Document every significant decision.
- Design for future hardware migration.
- Build something I can recover after a complete disk failure.

Those principles have influenced nearly every technical decision since.

## Current architecture

Tangolab currently runs Debian 13 directly on the hardware with Docker Compose managing the application stack.

Current services include:

- PostgreSQL
- OneDev
- Wiki.js
- Uptime Kuma
- Glances
- Restic
- Tailscale

Everything lives on a dedicated Docker network, application data is separated from the operating system, and backups are created automatically every night.

The server is intentionally private. Nothing is exposed publicly. All remote access happens through Tailscale.

## Documentation first

One goal I set from the beginning was to treat documentation as part of the project rather than something I'd write afterwards.

Every architectural decision, hardware change, backup procedure, security finding, and future improvement is documented inside the homelab itself using Wiki.js.

If the machine dies tomorrow, I don't want to rely on memory. I want enough documentation to rebuild the entire environment from scratch.

## More educational than expected

One thing surprised me during this project.

Getting everything running wasn't actually the most valuable part.

Reviewing every configuration afterwards was.

During a security audit I found several issues that I'd introduced myself, including weak backup credentials, incorrect file ownership, missing firewall rules, and permission problems that silently prevented offsite backups from working correctly.

None of those problems were particularly difficult to fix, but finding them taught me much more than following installation guides ever could.

## What's next?

Tangolab is still very much version 1.

Some of the next improvements I have planned include:

- testing backup restores end-to-end
- adding a reverse proxy
- upgrading the storage
- increasing available memory
- improving monitoring
- eventually migrating everything to newer hardware

Because the project is built around documentation and reproducibility, those upgrades should be evolutionary rather than requiring a complete rebuild.

I'm looking forward to seeing where Tangolab is a year from now.
