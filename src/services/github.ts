import axios from 'axios';
import { GitHubUser, Repository } from '../types/github';
import { sanitizeData } from '../utils/sanitize';
import { API_CONFIG } from '../config/api';
import { GitHubError } from '../utils/errors';
import { getUserStats } from './contributions';
export { getVisitorCount } from './visitors';

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
  if (!username) {
    throw new GitHubError('Username is required', 400);
  }

  try {
    const { data } = await api.get(`/users/${username}`);
    return sanitizeData(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new GitHubError(
        error.response?.data?.message || 'Failed to fetch user data',
        error.response?.status || 500
      );
    }
    throw new GitHubError('Failed to fetch user data', 500);
  }
}

export async function getRepositories(username: string): Promise<Repository[]> {
  if (!username) {
    throw new GitHubError('Username is required', 400);
  }

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
        error.response?.status || 500
      );
    }
    throw new GitHubError('Failed to fetch repositories', 500);
  }
}

export const getContributions = getUserStats;