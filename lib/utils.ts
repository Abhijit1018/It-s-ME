/**
 * Calculate estimated reading time for a body of text.
 * Assumes ~200 words per minute (realistic).
 */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString("en-GB", options ?? {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
