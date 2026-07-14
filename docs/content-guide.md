# Content Guide: Adding Projects and Writing Posts

Practical how-to for adding new content. For the underlying architecture (collections, routing,
theming), see `CLAUDE.md`. For why the stack is shaped this way, see `docs/tech-decisions.md`.

Both collections are defined and Zod-validated in `src/content.config.ts`. Invalid frontmatter
fails `npm run typecheck` and `npm run build` (and therefore CI) with a schema error pointing at
the offending field — that's the fastest way to check you got a new entry right.

## Adding a new project

1. Create `src/content/projects/<slug>.md`. The filename (minus extension) becomes the entry
   `id`, which becomes the URL: `/projects/<slug>`. Use kebab-case.
2. Fill in frontmatter:

   ```yaml
   ---
   title: 'Project Title'
   summary: 'One or two sentences, max 200 characters.'
   role: 'Solo Developer' # freeform string
   stack: ['C#', '.NET 10', 'xUnit']
   links:
     production: 'https://...' # optional
     repository: 'https://...' # optional
     release: 'https://...' # optional — renders a third "View Release" button
   status: 'production' # 'development' | 'production' | 'archived'
   dates:
     start: 2026-01-01
     end: null # null = ongoing/operational; omit end date display
   weight: 5 # int, controls homepage feature + /projects ordering (higher = first)
   ---
   ```

   All of `links.*` are optional — only the ones present render a button on the case-study page.
   `weight` only matters relative to other projects; the homepage (`src/pages/index.astro`) shows
   the top 2 by weight, `/projects` (`src/pages/projects.astro`) shows all of them in the same
   order.

3. Write the body in Markdown below the frontmatter — it renders into the case-study page's prose
   column (`src/pages/projects/[id].astro`). Existing entries use `## Context`, `## What I
delivered`, `## Outcome` as a loose convention, not an enforced structure.
4. No registration step needed elsewhere — `getStaticPaths()` in
   `src/pages/projects/[id].astro` picks up every entry in the collection automatically, and it
   appears on `/projects` and (if `weight` is high enough) the homepage.

## Adding a new writing post

1. Create `src/content/writing/<slug>.md`. The filename becomes the entry `id`, used both for the
   URL (`/writing/<slug>`) and in `src/pages/rss.xml.js`.
2. Fill in frontmatter:

   ```yaml
   ---
   title: 'Post Title'
   summary: 'One or two sentences, max 250 characters.'
   date: 2026-07-14
   tags: ['C#', '.NET', 'Performance'] # freeform strings, no separate tags collection
   draft: false
   project: directory-sync-tool # optional — id of a matching entry in src/content/projects
   ---
   ```

   - `tags` are free-form strings, not a controlled vocabulary — each is slugified
     (`src/lib/slug.ts`) on the fly to build `/writing/tags/<slug>` pages
     (`src/pages/writing/tags/[tag].astro`). Reuse existing tag text where it makes sense (check
     other posts) so entries land on the same tag page instead of near-duplicates (e.g. `.NET` vs
     `dotnet`).
   - `draft: true` excludes the post from the build and RSS feed entirely, except when running
     `npm run dev` (`import.meta.env.DEV`) — use it for in-progress posts you want to preview
     locally without publishing.
   - `project` is optional and must match the `id` (filename, no extension) of an existing entry
     in `src/content/projects/`. Astro's `reference()` validates this at build time — a typo or
     nonexistent project id fails `typecheck`/`build`. Setting it links the post automatically in
     both directions: the post page shows a "Related Project" link, and the referenced project's
     case-study page lists the post under "Related Writing" in the sidebar. Only set this when the
     post is genuinely about that project — it's for direct write-ups, not passing mentions.

3. Write the body in Markdown below the frontmatter — it renders into the post page's prose column
   (`src/pages/writing/[id].astro`).
4. No registration step needed elsewhere — same `getStaticPaths()` pattern as projects picks up
   every non-draft entry automatically for `/writing`, the RSS feed, and tag pages.

## Verifying a new entry

After adding either kind of entry, run:

```
npm run typecheck   # catches frontmatter schema errors, including a bad `project` reference
npm run build       # confirms the page actually renders
```

There's no content test suite — `astro check` + a successful build is the correctness bar for
frontmatter and rendering.
