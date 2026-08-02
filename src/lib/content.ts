import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('writing', (post) => !post.data.draft || import.meta.env.DEV);
  // Two posts share 2026-07-18. Without the id tie-breaker their relative order
  // comes from the filesystem, so which one the homepage features is incidental.
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id),
  );
}

export async function getSortedProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => b.data.weight - a.data.weight || a.id.localeCompare(b.id));
}

/**
 * Posts pointing at a project via the `project` reference field. Routed through
 * getPublishedPosts so the draft rule lives in exactly one place.
 */
export async function getRelatedPosts(projectId: string) {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.project?.id === projectId);
}
