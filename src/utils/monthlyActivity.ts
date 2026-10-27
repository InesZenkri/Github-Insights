import { Contribution } from '../types/github';

export interface MonthlyActivity {
  month: string; // YYYY-MM
  count: number;
  days: number; // days of this month covered by the calendar
  partial: boolean; // first or last month, not fully covered
}

// Sums the public contribution calendar by calendar month. Dates are read as
// text (YYYY-MM-DD), so time zones cannot shift a day into another month.
export function aggregateByMonth(days: Contribution[]): MonthlyActivity[] {
  const months = new Map<string, { count: number; days: number }>();

  for (const day of days) {
    const month = day.date.slice(0, 7);
    const entry = months.get(month) ?? { count: 0, days: 0 };
    entry.count += day.count;
    entry.days += 1;
    months.set(month, entry);
  }

  return Array.from(months, ([month, { count, days: covered }]) => {
    const [year, mon] = month.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
    return { month, count, days: covered, partial: covered < daysInMonth };
  }).sort((a, b) => a.month.localeCompare(b.month));
}
