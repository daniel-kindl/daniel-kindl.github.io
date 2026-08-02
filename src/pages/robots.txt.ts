import type { APIContext } from 'astro';

// A route rather than a static public/ file so the origin comes from
// astro.config.mjs. The hand-typed copy went stale once already when the site
// moved off the github.io subdomain (ADR #13).
export function GET(context: APIContext) {
  const origin = context.site!.origin;

  const body = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Host & Sitemap Mapping Direction
Host: ${origin}
Sitemap: ${origin}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
