import rss from '@astrojs/rss';
import { getPublishedPosts } from '@lib/content';

export async function GET(context) {
  const sortedPosts = await getPublishedPosts();

  return rss({
    title: 'Daniel Kindl — Writing',
    description: 'Technical notes and articles on software engineering.',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
