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
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string | null;
  topics?: string[];
  license?: { spdx_id: string | null; name: string } | null;
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

export type PullRequestState = 'merged' | 'open' | 'closed';

export interface ExternalPullRequest {
  title: string;
  url: string;
  repo: string; // owner/name
  repoUrl: string;
  state: PullRequestState;
  updatedAt: string;
}

export interface ExternalPullRequestResult {
  items: ExternalPullRequest[];
  totalCount: number;
}
