import { Repository } from '../types/github';

export interface LanguageGroup {
  language: string;
  repos: Repository[];
}

// Groups repositories by the primary language GitHub reports for each one.
// Repositories are listed most recently pushed first. Forks are left out
// unless includeForks is true, because a fork is not the user's own work.
export function groupReposByLanguage(
  repos: Repository[],
  includeForks: boolean
): LanguageGroup[] {
  const groups = new Map<string, Repository[]>();

  for (const repo of repos) {
    if (!repo.language) continue;
    if (repo.fork && !includeForks) continue;
    const list = groups.get(repo.language) ?? [];
    list.push(repo);
    groups.set(repo.language, list);
  }

  const byPush = (a: Repository, b: Repository) =>
    (b.pushed_at ?? '').localeCompare(a.pushed_at ?? '');

  return Array.from(groups, ([language, list]) => ({
    language,
    repos: [...list].sort(byPush),
  })).sort(
    (a, b) => b.repos.length - a.repos.length || a.language.localeCompare(b.language)
  );
}

export function formatPushDate(value: string | null): string {
  if (!value) return 'unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return date.toISOString().slice(0, 10);
}
