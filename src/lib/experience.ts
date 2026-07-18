const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

export function getYearsOfExperience(startDate: Date): number {
  return Math.floor((Date.now() - startDate.getTime()) / MS_PER_YEAR);
}
