interface ProjectDates {
  start: Date;
  end: Date | null;
}

export function getProjectTimelineLabel({ start, end }: ProjectDates): string {
  const startYear = start.getFullYear();
  if (!end) return `${startYear}–Present`;
  const endYear = end.getFullYear();
  return endYear === startYear ? `${startYear}` : `${startYear}–${endYear}`;
}
