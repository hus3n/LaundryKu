export function formatDuration(hours: number): string {
  if (hours >= 24 && hours % 24 === 0) {
    return `${hours / 24} hari`;
  }
  return `${hours} jam`;
}
