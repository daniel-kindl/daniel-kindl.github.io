---
title: 'Proving a Specification Is Implemented, Automatically'
summary: 'Turning requirements traceability into something an automated report can answer, by tagging TDD unit tests with the issue number of the specification they verify.'
date: 2026-07-18
tags: ['.NET', 'TDD', 'Testing', 'CI/CD']
draft: false
---

## The problem

A software specification is only useful if you can tell whether it's actually implemented. On paper this sounds trivial: read the spec, check the code, done. In practice, on a codebase being rebuilt from a twenty-year-old predecessor, specifications live in a ticket system as one-off issues, and nobody maintains a mapping back to the code that satisfies them. The mapping exists in someone's head for a while, then it doesn't.

The usual fix is a traceability matrix: a spreadsheet linking requirement IDs to code or test IDs, updated by hand. It's accurate the day someone writes it and wrong a week later, because nothing forces it to stay in sync with the actual code.

## Tests as the source of truth

We're doing this rewrite with test-driven development: for a given specification, the unit test gets written before the implementation. That ordering turns out to be the useful part. If a test exists and fails, the specification it covers is provably not implemented yet, not just undocumented. If it exists and passes, the specification is provably covered. There's no ambiguous middle state where a requirement might or might not be done.

That gave us a hook: instead of maintaining a matrix separately from the code, attach the requirement directly to the test that proves it.

## Tagging tests with the issue number

Each unit test that verifies a specification carries a required attribute holding the issue number of that specification in our ticket system. Something like:

```csharp
[Fact]
[Requirement("SPEC-482")]
public void RejectsOrderWhenInventoryIsInsufficient()
{
    // ...
}
```

The requirement isn't a comment or a naming convention, it's a first-class attribute the test runner can read back. That matters, because the link between spec and test lives in the same file the developer is already editing, and can't silently drift the way an external spreadsheet does.

## From test results to a report

A script reads the test results produced by the pipeline, pulls out every `Requirement` attribute value, and groups results by issue number. The output is a small static HTML page: search or filter by issue number, and see the pass/fail state of every test tagged with it.

The rule is simple. If every test for a given issue number passes, that specification is implemented. If any test for it fails, it isn't, at least not correctly. Because of TDD ordering, a specification with no passing tests yet doesn't get a blank or unknown status either, it just shows as failing, which is honestly what "not implemented" should look like.

## What this doesn't prove

A passing test proves the code satisfies that specific test, not that the test fully captures what the specification actually asked for. If the test itself is wrong or incomplete, the report will happily call the spec "implemented" while quietly missing part of it. This isn't a solved problem, and I don't think tooling alone solves it. It just moves the risk from "did anyone check this was built," which is very easy to get wrong, to "was this specific test written correctly," which is still a real risk but a much smaller and more reviewable one.

I'm still in the middle of testing this against our actual specification set, so I don't have a clean before/after number to point to yet. But the difference in how it feels to check compliance is already noticeable: instead of asking someone whether a requirement was implemented and trusting the answer, I open a page and filter by issue number.

## Takeaway

None of the individual pieces here are new. Attribute-based test metadata, TDD, and generating a report from CI output are all well-worn techniques on their own. What made it worth building was combining them so the traceability status is a byproduct of tests that already have to exist, instead of a document someone has to remember to update.
