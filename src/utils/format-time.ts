/**
 * Formats time in minutes to a human-readable string
 * @param minutes - Time in minutes
 * @returns Formatted string (e.g., "2h 30m", "45m", "0m")
 */
export function formatTime(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return "0m";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}



