/**
 * Identity constants that appear in more than one place and can silently drift.
 *
 * Deliberately excludes the site origin: that lives in `astro.config.mjs` as
 * `site` and is read via `Astro.site`. Mirroring it here would create a second
 * source to keep in sync, which is the problem this file exists to remove.
 * The colour palette stays in `global.css` for the same reason — CSS cannot
 * import TypeScript, so a TS copy could only ever drift.
 */
export const siteConfig = {
  name: 'Daniel Kindl',
  email: 'daniel.kindl@proton.me',
  feedTitle: 'Daniel Kindl — Writing',
  feedDescription: 'Technical notes and articles on software engineering.',
  socials: {
    github: 'https://github.com/daniel-kindl',
    linkedin: 'https://www.linkedin.com/in/kindldaniel/',
  },
} as const;

export const mailto = `mailto:${siteConfig.email}`;

/** `pageTitle('Projects')` -> `'Projects — Daniel Kindl'`. */
export function pageTitle(title: string): string {
  return `${title} — ${siteConfig.name}`;
}
