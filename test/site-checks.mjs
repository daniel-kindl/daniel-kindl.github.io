// Pure helpers for built-site sanity checks. No dependencies beyond Node.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

export const SITE_ORIGIN = 'https://danielkindl.dev';

export function listHtmlFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'pagefind') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listHtmlFiles(full, base));
    else if (name.endsWith('.html')) out.push(posix.normalize(full.slice(base.length + 1)));
  }
  return out;
}

export function extractLinks(html) {
  const links = [];
  const re = /\s(?:href|src)="([^"]*)"/g;
  for (const m of html.matchAll(re)) links.push(m[1].replaceAll('&amp;', '&'));
  return links;
}

export function extractIds(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}

/** Map a site path (no origin) to a file in dist, or null. */
export function resolvePath(distDir, pathname) {
  const clean = decodeURIComponent(pathname.split('?')[0]);
  const candidates = clean.endsWith('/')
    ? [join(distDir, clean, 'index.html')]
    : [join(distDir, clean), join(distDir, clean, 'index.html'), join(distDir, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/** Return broken internal links and anchors for one page. */
export function findBrokenLinks(distDir, pageRel, html, readPage = (f) => readFileSync(f, 'utf8')) {
  const broken = [];
  const pageUrl = new URL(`/${pageRel}`, SITE_ORIGIN);
  for (const raw of extractLinks(html)) {
    if (raw === '') continue;
    let url;
    try {
      url = new URL(raw, pageUrl);
    } catch {
      broken.push(`${pageRel}: ${raw} (invalid URL)`);
      continue;
    }
    if (url.origin !== SITE_ORIGIN) continue;
    const hash = url.hash.slice(1);
    let file;
    if (url.pathname === pageUrl.pathname) file = join(distDir, pageRel);
    else {
      file = resolvePath(distDir, url.pathname);
      if (!file) {
        broken.push(`${pageRel}: ${raw} (missing target)`);
        continue;
      }
    }
    if (
      hash &&
      file.endsWith('.html') &&
      !extractIds(readPage(file)).has(decodeURIComponent(hash))
    ) {
      broken.push(`${pageRel}: ${raw} (missing anchor)`);
    }
  }
  return broken;
}

export function draftIds(writingDir) {
  return readdirSync(writingDir)
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => {
      const fm = readFileSync(join(writingDir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/);
      return fm && /^draft:\s*true\s*$/m.test(fm[1]);
    })
    .map((f) => f.replace(/\.mdx?$/, ''));
}

export function xmlTagValues(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}>([^<]*)</${tag}>`, 'g'))].map((m) => m[1]);
}

/**
 * Return problems with images inside <figure> elements for one page. Every figure image needs
 * a non-empty alt and must not be aria-hidden. A figure with a theme variant hides the inactive
 * image with display: none, so each image carries the same alt.
 */
export function findFigureImageProblems(pageRel, html) {
  const problems = [];
  for (const figure of html.matchAll(/<figure[\s>][\s\S]*?<\/figure>/g)) {
    for (const img of figure[0].matchAll(/<img\b[^>]*>/g)) {
      const tag = img[0];
      const alt = tag.match(/\salt(?:="([^"]*)")?/);
      if (!alt || !alt[1]?.trim()) problems.push(`${pageRel}: figure image has no alt text`);
      if (/\saria-hidden=/.test(tag)) problems.push(`${pageRel}: figure image is aria-hidden`);
    }
  }
  return problems;
}

/** Return the URL a built page must declare as canonical. */
export function expectedCanonical(pageRel) {
  return '';
}

/** Return problems with the head metadata and the h1 count of one built page. */
export function findHeadMetadataProblems(pageRel, html) {
  return [];
}

/** True when the page has a robots meta tag that contains noindex. */
export function hasNoindex(html) {
  return false;
}
