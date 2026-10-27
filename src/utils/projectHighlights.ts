import { Repository } from '../types/github';

export const HIGHLIGHT_LIMIT = 6;

// Picks up to HIGHLIGHT_LIMIT repositories to show first. The rule is simple
// and visible on screen: own repositories only (no forks, no archived),
// most stars first, then most recently pushed. It is a way to decide what to
// open first, not a measure of quality.
export function pickHighlights(repos: Repository[]): Repository[] {
  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        (b.pushed_at ?? '').localeCompare(a.pushed_at ?? '')
    )
    .slice(0, HIGHLIGHT_LIMIT);
}

export function formatPushDate(value: string | null): string {
  if (!value) return 'unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return date.toISOString().slice(0, 10);
}
