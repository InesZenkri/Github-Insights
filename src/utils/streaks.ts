import { Contribution } from '../types/github';

export function calculateStreak(contributions: Contribution[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate both streaks in one pass
  for (let i = 0; i < contributions.length; i++) {
    const contribution = contributions[i];
    const date = new Date(contribution.date);
    date.setHours(0, 0, 0, 0);
    
    if (contribution.count > 0) {
      tempStreak++;
      
      // Update longest streak if current temp streak is longer
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // Update current streak if this is part of the most recent streak
      if (Math.abs(today.getTime() - date.getTime()) <= tempStreak * 24 * 60 * 60 * 1000) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  return { currentStreak, longestStreak };
}