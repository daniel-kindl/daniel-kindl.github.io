import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '@lib/content';
import { siteConfig } from '@lib/siteConfig';

export async function GET(context: APIContext) {
  const sortedPosts = await getPublishedPosts();

  return rss({
    title: siteConfig.feedTitle,
    description: siteConfig.feedDescription,
    // Set in astro.config.mjs, so it is always defined at build time.
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
