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

export function blogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  return {};
}

export function serializeJsonLd(data: unknown): string {
  return '';
}
