export function calculateLongestStreak(contributions: { date: string; contributionCount: number }[]): number {
  let currentStreak = 0;
  let maxStreak = 0;

  for (const day of contributions) {
    if (day.contributionCount > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

export function calculateCurrentStreak(contributions: { date: string; contributionCount: number }[]): number {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = contributions.length - 1; i >= 0; i--) {
    const contribution = contributions[i];
    if (contribution.date.split('T')[0] === today && contribution.contributionCount === 0) {
      break;
    }
    if (contribution.contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}