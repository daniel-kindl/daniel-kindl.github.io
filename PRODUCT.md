# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are hiring managers and technical recruiters evaluating Daniel Kindl as a candidate
for software engineering roles. Their job here: quickly verify that the engineering practice
claimed (production discipline, testing, CI/CD, real shipped work) is real rather than asserted —
skimming project case studies, the CV/experience timeline, and writing posts as evidence, not just
a summary of skills.

## Product Purpose

A production portfolio site that demonstrates software engineering craft through the site itself
and the work it documents, rather than through self-description. Success is a visitor concluding
the claimed engineering discipline is real and credible enough to warrant a conversation.

## Positioning

The evidence is the pitch: real CI/CD pipelines, automated testing, security scanning, Lighthouse
performance budgets, and maintained (not abandoned) repositories, applied to the portfolio site's
own build as much as to the projects it showcases. A comparably experienced engineer's portfolio
could describe similar skills, but couldn't truthfully point to this same standard of production
rigor without actually doing the work.

## Operating Context

- Static Astro 7 site, deployed to GitHub Pages, content-driven via Zod-validated `projects` and
  `writing` collections.
- Two case-study projects on hand: a solo-built C#/.NET CLI tool (directory-sync, dirsync) with 42
  unit tests, multi-platform CI/CD, and CodeQL scanning; and this portfolio site itself, positioned
  as a maintained engineering project (typed content architecture, CI/CD, SEO).
- Writing posts cover engineering practice topics: AI-assisted development workflow, spec
  traceability with TDD, a homelab writeup, and a tiered comparison behind the directory-sync tool
  — these serve as secondary evidence of technical depth and communication ability.
- CV/experience data (`src/data/cv.ts`) covers a day-job background in C#/.NET, Avalonia UI desktop
  apps, industrial device integration, and Git/CI infrastructure ownership at SPS software s.r.o.,
  spanning junior through current engineer roles.

## Capabilities and Constraints

- Currently employed; the site should read as professionally available for conversation, not as an
  urgent or desperate job search. No aggressive "hire me now" framing.
- No fabricated evidence: no client testimonials, customer logos, usage metrics, or case studies
  beyond the two real projects and the CV facts already on record. Undecided or unavailable facts
  stay absent rather than invented.
- Content is data-driven through Astro content collections; new project/writing entries follow
  `docs/content-guide.md`, not ad hoc page edits.

## Brand Commitments

Name: Daniel Kindl. Role framing: Software Engineer. Tone across existing copy is plain,
factual, and specific (concrete deliverables and outcomes) rather than promotional — this voice is
an existing commitment, not open for reinterpretation without the user's sign-off.

## Evidence on Hand

- `src/content/projects/directory-sync-tool.md` — dirsync CLI tool, solo developer, released
  v1.0.0, real repo and release links.
- `src/content/projects/production-portfolio-system.md` — this site, lead engineer, real
  production and repo links.
- `src/content/writing/*.md` — four real posts (AI-assisted development workflow, spec
  traceability with TDD, homelab, tiered comparison for directory-sync).
- `src/data/cv.ts` — real employment history and skills at SPS software s.r.o.
- No testimonials, client logos, press mentions, or usage metrics exist; future work must not
  invent them.

## Product Principles

1. Every claim of engineering rigor must be backed by something a visitor can actually inspect
   (repo, CI badge, test count, live site) — never asserted without evidence.
2. Prefer specific, verifiable detail (test counts, stack, dates, outcomes) over generic
   self-praise in any new or edited copy.
3. Tone stays professional-and-available, not urgent — this is a working engineer's record, not a
   job-search landing page.
4. New content follows the existing data-driven collection architecture rather than one-off pages.
5. Never fabricate evidence (testimonials, metrics, clients) to fill a perceived gap; leave it
   absent and flag it instead.

## Accessibility & Inclusion

No product-specific accessibility requirement beyond general web accessibility best practice.
