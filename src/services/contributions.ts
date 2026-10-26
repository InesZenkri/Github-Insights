import { UserStats, Contribution } from '../types/github';
import { getRepositoryLanguages } from '../utils/languages';
import { GitHubError } from '../utils/errors';
import { calculateStreak } from '../utils/streaks';

interface ContributionsApiResponse {
  username: string;
  total: number;
  days: Contribution[];
}

// Real contribution data, served by the same-origin /api/contributions
// endpoint (a Netlify function in production, a Vite middleware in dev).
// It reads GitHub's public contribution calendar, so no token is needed
// in the browser and only public contribution data is shown.
async function fetchContributions(
  username: string
): Promise<ContributionsApiResponse> {
  let response: Response;
  try {
    response = await fetch(
      `/api/contributions?username=${encodeURIComponent(username)}`
    );
  } catch {
    throw new GitHubError('Failed to reach the contributions service', 503);
  }

  let payload: { error?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    // Non-JSON error responses are handled by the status check below.
  }

  if (!response.ok) {
    throw new GitHubError(
      payload?.error || 'Failed to fetch contribution data',
      response.status
    );
  }

  return payload as unknown as ContributionsApiResponse;
}

export async function getUserStats(username: string): Promise<UserStats> {
  if (!username) {
    throw new GitHubError('Username is required', 400);
  }

  try {
    const [{ total, days }, languages] = await Promise.all([
      fetchContributions(username),
      getRepositoryLanguages(username),
    ]);
    const { currentStreak, longestStreak } = calculateStreak(days);

    return {
      totalContributions: total,
      currentStreak,
      longestStreak,
      mostUsedLanguages: languages,
      contributionsByDay: days,
    };
  } catch (error) {
    if (error instanceof GitHubError) {
      throw error;
    }
    throw new GitHubError('Failed to fetch user stats', 500);
  }
}
