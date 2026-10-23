import { toIsoDate } from './formatDate.ts';

export interface BlogPostingInput {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  keywords: string[];
  authorName: string;
  authorUrl: string;
}

/** schema.org BlogPosting data for one post. Dates use the UTC day, like `<time datetime>`. */
export function blogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: input.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    image: input.image,
    datePublished: toIsoDate(input.datePublished),
    ...(input.dateModified && { dateModified: toIsoDate(input.dateModified) }),
    ...(input.keywords.length > 0 && { keywords: input.keywords.join(', ') }),
    author: { '@type': 'Person', name: input.authorName, url: input.authorUrl },
  };
}

/**
 * JSON text that is safe inside a `<script type="application/ld+json">` element. It escapes the
 * characters that could end the element or start an HTML comment, and the two line separators.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}
