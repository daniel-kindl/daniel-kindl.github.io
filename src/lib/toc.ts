import type { MarkdownHeading } from 'astro';

/** Below H3 the nesting is too fine to navigate by, so the rail stops there. */
export function getTocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
}

/** A single-entry rail is just a link to the top of the page — not worth the column. */
export function hasToc(tocHeadings: MarkdownHeading[]): boolean {
  return tocHeadings.length >= 2;
}
