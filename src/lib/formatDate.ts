/** The machine-readable counterpart to formatDate — same UTC day, for <time datetime>. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Frontmatter dates are UTC midnight, so the viewer's zone must not shift the day. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
