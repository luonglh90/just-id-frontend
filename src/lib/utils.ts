// utils.ts
/**
 * Format seconds into MM:SS countdown string.
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "Expires in 0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `Expires in  ${m}:${s.toString().padStart(2, "0")}`;
}
