interface ProjectDates {
  start: Date;
  end: Date | null;
}

export function getProjectTimelineLabel({ start, end }: ProjectDates): string {
  const startYear = start.getUTCFullYear();
  if (!end) return `${startYear}–Present`;
  const endYear = end.getUTCFullYear();
  return endYear === startYear ? `${startYear}` : `${startYear}–${endYear}`;
}
