import type { CollectionEntry } from 'astro:content';

type ProjectStatus = CollectionEntry<'projects'>['data']['status'];

const projectStatusLabels: Record<ProjectStatus, string> = {
  development: 'In Development',
  finished: 'Shipped',
  maintaining: 'Actively Maintained',
  archived: 'Archived',
};

export function getProjectStatusLabel(status: ProjectStatus): string {
  return projectStatusLabels[status];
}
