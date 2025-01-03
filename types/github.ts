export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface Repository {
  name: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export interface Contribution {
  date: string;
  count: number;
}

export interface UserStats {
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
  mostUsedLanguages: { language: string; count: number }[];
  contributionsByDay: Contribution[];
}