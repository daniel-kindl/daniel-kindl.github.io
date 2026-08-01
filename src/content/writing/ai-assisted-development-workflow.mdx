---
title: 'What AI-Assisted Development Actually Looks Like, Day to Day'
summary: 'Building and maintaining this site with Claude Code: why the CI pipeline is the real guardrail, and why a feature working correctly is not the same as it being the right call.'
date: 2026-07-18
tags: ['AI-Assisted Development', 'Workflow', 'CI/CD']
draft: false
project: production-portfolio-system
---

## The setup

This site is built and maintained with Claude Code doing most of the typing. That sentence tends to get read two different ways: either as a productivity flex or as a confession that a human didn't really do the work. Neither is accurate. What it actually looks like is closer to managing a very fast, very literal contributor who needs the same guardrails as anyone else committing to a shared repo, plus a few new ones specific to how it fails.

## The gate does the trusting, not me

Every pull request here runs the same sequence: regenerate assets, lint, format check, type check, then a full production build. Pushes to `master` add a Lighthouse CI budget check before deploying. None of that is unusual for a small static site. What's different is that I don't review every line before it runs through the pipeline. I don't need to, because the pipeline doesn't care who wrote the diff. A broken type or a failed build blocks the merge regardless of whether a human or a model produced it.

That's the actual trust boundary. I'm not trusting the model to be right. I'm trusting a set of checks that were right before the model existed. The one rule I hold to strictly is that a lint warning or a type hint counts as a failure, not a suggestion. Early on, letting "just a warning" slide once meant it slid every time after. Treating warnings as build-blocking removed that judgment call entirely.

## Debugging is where it earns its keep

The clearest example of where this workflow actually helps was a search feature that worked perfectly in development and silently failed in production, with no error message, just an unhelpful fallback string.

The cause turned out to be specific to how the build tool handles dynamic imports. Vite wraps every `import()` call it can statically see with a preload helper that expects a build-time substitution. That substitution never happened for the search library's script, because it's a static asset generated after the build, outside Vite's module graph entirely. The import shipped a literal, unresolved placeholder and failed at runtime.

Finding that meant reading the compiled output directly rather than guessing, since there was no way to attach a browser console to the deployed site. The fix was to hide the import from Vite's static analysis so it never got wrapped in the first place:

```js
const dynamicImport = new Function('path', 'return import(path)');
const pagefind = await dynamicImport('/pagefind/pagefind.js');
```

That's the kind of bug that rewards patience over speed: forming a hypothesis, checking it against the actual compiled bytes, and ruling it out or confirming it before touching code again. It's also exactly the kind of work an AI-assisted workflow can grind through without getting tired of it.

## Working code is not the same as the right call

Not everything that got built stayed. At one point there was a fully working interactive demo on one of the project case-study pages: a small visualizer that walked through a tiered file-comparison strategy, live, in the browser. It worked. It was debugged, tested, and rendering correctly.

I killed it anyway, because it didn't fit where I want project pages to go. There was no bug to point to and no argument about whether the code was correct. It just wasn't the right thing to have there. That's not a decision an AI-assisted workflow can make for you, and it shouldn't try to. The model can build a feature end to end; whether that feature belongs on the site is a product call, not an engineering one.

## What a review pass actually catches

Later, I ran a full code review pass over the repository rather than just the latest change. It surfaced two small things worth fixing: a search result was being rendered with `innerHTML` and no comment explaining why that was safe, and an async search call had no error handling, so a failure would have shown up as a silent, unhandled rejection instead of a message the visitor could see.

Neither was a bug anyone would likely hit. Both were the kind of thing that looks fine right up until it doesn't, and both are easy to miss when you're heads-down building the next feature instead of stepping back to read what's already there. Fixing them took minutes. Noticing they existed took deliberately asking for a review instead of assuming the working code was also the reviewed code.

## Takeaway

None of this is about whether AI can write a portfolio site. It can, clearly. The more useful question is what has to be true around it for that to be safe: a pipeline that enforces its own rules regardless of who's committing, a habit of asking for review instead of assuming correctness, and someone still deciding what should exist at all. Take any of those three away and the workflow stops being trustworthy, no matter how good the code looks.
