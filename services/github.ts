import axios from 'axios';
import { GitHubUser, Repository, UserStats } from '../types/github';
import { sanitizeData } from '../utils/sanitize';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streaks';
import { getRepositoryLanguages } from '../utils/languages';
import { API_CONFIG } from '../config/api';
import { GitHubError } from '../utils/errors';

const api = axios.create({
  baseURL: API_CONFIG.GITHUB_API,
  timeout: 10000,
  headers: {
    ...API_CONFIG.HEADERS,
    ...(API_CONFIG.GITHUB_TOKEN && {
      Authorization: `token ${API_CONFIG.GITHUB_TOKEN}`,
    }),
  },
});

export async function getUser(username: string): Promise<GitHubUser> {
  try {
    const { data } = await api.get(`/users/${username}`);
    return sanitizeData(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new GitHubError(
        error.response?.data?.message || 'Failed to fetch user data',
        error.response?.status
      );
    }
    throw new GitHubError('Failed to fetch user data');
  }
}

export async function getRepositories(username: string): Promise<Repository[]> {
  try {
    const { data } = await api.get(`/users/${username}/repos`, {
      params: {
        per_page: 100,
        sort: 'updated',
        type: 'owner',
      },
    });
    return sanitizeData(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new GitHubError(
        error.response?.data?.message || 'Failed to fetch repositories',
        error.response?.status
      );
    }
    throw new GitHubError('Failed to fetch repositories');
  }
}

// Mock contribution data since we don't have a backend
export async function getContributions(username: string): Promise<UserStats> {
  try {
    // Simulate contribution data since we don't have a backend
    const mockContributions = Array.from({ length: 365 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      contributionCount: Math.floor(Math.random() * 10),
    }));

    const languages = await getRepositoryLanguages(username);
    
    return sanitizeData({
      totalContributions: mockContributions.reduce((sum, day) => sum + day.contributionCount, 0),
      longestStreak: calculateLongestStreak(mockContributions),
      currentStreak: calculateCurrentStreak(mockContributions),
      mostUsedLanguages: languages,
      contributionsByDay: mockContributions,
    });
  } catch (error) {
    if (error instanceof GitHubError) {
      throw error;
    }
    throw new GitHubError('Failed to fetch contributions');
  }
}