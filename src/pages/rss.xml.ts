import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '@lib/content';

export async function GET(context: APIContext) {
  const sortedPosts = await getPublishedPosts();

  return rss({
    title: 'Daniel Kindl — Writing',
    description: 'Technical notes and articles on software engineering.',
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
