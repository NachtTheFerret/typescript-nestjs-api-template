export const ONE_MINUTE = 60; // seconds
export const FIVE_MINUTES = 5 * ONE_MINUTE;
export const FIFTEEN_MINUTES = 15 * ONE_MINUTE;
export const THIRTY_MINUTES = 30 * ONE_MINUTE;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const SIX_HOURS = 6 * ONE_HOUR;
export const TWELVE_HOURS = 12 * ONE_HOUR;
export const ONE_DAY = 24 * ONE_HOUR;
export const SEVEN_DAYS = 7 * ONE_DAY;
export const THIRTY_DAYS = 30 * ONE_DAY;
export const NINETY_DAYS = 90 * ONE_DAY;
export const ONE_YEAR = 365 * ONE_DAY;

/**
 * Parses a duration string into seconds.
 * Supported units: s (seconds), m (minutes), h (hours), d (days), w (weeks), y (years)
 * @param duration A duration string (e.g. "1h30m", "2d", "3w4d12h")
 * @returns The total duration in seconds
 * @throws Error if the duration string is invalid
 */
export function parseDuration(duration: string): number {
  const regex = /(\d+)([smhdwy])/g;
  let match: RegExpExecArray | null;
  let totalSeconds = 0;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit === 's') totalSeconds += value;
    else if (unit === 'm') totalSeconds += value * ONE_MINUTE;
    else if (unit === 'h') totalSeconds += value * ONE_HOUR;
    else if (unit === 'd') totalSeconds += value * ONE_DAY;
    else if (unit === 'w') totalSeconds += value * 7 * ONE_DAY;
    else if (unit === 'y') totalSeconds += value * 365 * ONE_DAY;
    else throw new Error(`Invalid duration unit: ${unit}`);
  }

  return totalSeconds;
}
