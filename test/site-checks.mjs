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
  const pageDir = posix.dirname(`/${pageRel}`);
  for (const raw of extractLinks(html)) {
    let url = raw;
    if (url.startsWith(SITE_ORIGIN)) url = url.slice(SITE_ORIGIN.length) || '/';
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url === '') continue;
    const [path, hash] = url.split('#');
    let file;
    if (path === '') file = join(distDir, pageRel);
    else {
      const abs = path.startsWith('/') ? path : posix.join(pageDir, path);
      file = resolvePath(distDir, abs);
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
