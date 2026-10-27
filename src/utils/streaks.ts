import { Contribution } from '../types/github';

const DAY_MS = 24 * 60 * 60 * 1000;

function toDay(dateString: string): number {
  return Date.parse(`${dateString.slice(0, 10)}T00:00:00Z`);
}

/**
 * Calculate streaks from daily contribution counts.
 *
 * - longestStreak: the longest run of consecutive days with at least one
 *   contribution.
 * - currentStreak: the run ending at the most recent active day, counted
 *   only while that day is the latest calendar day or the day before it
 *   (today may simply not have contributions yet).
 *
 * Works purely on the calendar dates in the data, so the result does not
 * depend on the visitor's timezone.
 */
export function calculateStreak(contributions: Contribution[]) {
  const activeDays = [
    ...new Set(
      contributions.filter((c) => c.count > 0).map((c) => toDay(c.date))
    ),
  ].sort((a, b) => a - b);

  let longestStreak = 0;
  let run = 0;
  let previous = 0;

  for (const day of activeDays) {
    run = day - previous === DAY_MS ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    previous = day;
  }

  let currentStreak = 0;
  if (activeDays.length > 0 && contributions.length > 0) {
    const lastActive = activeDays[activeDays.length - 1];
    const lastCalendarDay = Math.max(
      ...contributions.map((c) => toDay(c.date))
    );
    if (lastCalendarDay - lastActive <= DAY_MS) {
      currentStreak = run;
    }
  }

  return { currentStreak, longestStreak };
}
