import { UserStats, Contribution } from '../types/github';
import { getRepositoryLanguages } from '../utils/languages';
import { GitHubError } from '../utils/errors';
import { calculateStreak } from '../utils/streaks';

// Generate realistic contribution data
function generateContributions(): Contribution[] {
  const today = new Date();
  const contributions: Contribution[] = [];
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate more realistic contribution counts
    // Higher chance of contributions on weekdays
    const isWeekday = date.getDay() !== 0 && date.getDay() !== 6;
    const baseCount = isWeekday ? 5 : 2;
    const count = Math.random() < 0.7 ? Math.floor(Math.random() * baseCount) : 0;
    
    contributions.push({
      date: date.toISOString(),
      count
    });
  }
  
  return contributions.reverse(); // Most recent first
}

export async function getUserStats(username: string): Promise<UserStats> {
  if (!username) {
    throw new GitHubError('Username is required', 400);
  }

  try {
    const contributions = generateContributions();
    const languages = await getRepositoryLanguages(username);
    const { currentStreak, longestStreak } = calculateStreak(contributions);
    
    const totalContributions = contributions.reduce(
      (sum, day) => sum + day.count, 
      0
    );

    return {
      totalContributions,
      currentStreak,
      longestStreak,
      mostUsedLanguages: languages,
      contributionsByDay: contributions
    };
  } catch (error) {
    if (error instanceof GitHubError) {
      throw error;
    }
    throw new GitHubError('Failed to generate user stats', 500);
  }
}