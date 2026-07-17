import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('writing', (post) => !post.data.draft || import.meta.env.DEV);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getSortedProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => b.data.weight - a.data.weight);
}
