import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { GitHubError } from '../utils/errors';

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

// GitHub usernames: 1-39 characters, letters, digits and single hyphens.
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const EXTERNAL_PR_LIMIT = 30;

interface SearchItem {
  title: string;
  html_url: string;
  repository_url: string;
  updated_at: string;
  state: string;
  pull_request?: { merged_at: string | null };
}

export function toExternalPullRequest(item: SearchItem): ExternalPullRequest {
  const repo = item.repository_url.replace(/^.*\/repos\//, '');
  const state = item.pull_request?.merged_at
    ? 'merged'
    : item.state === 'open'
      ? 'open'
      : 'closed';

  return {
    title: item.title,
    url: item.html_url,
    repo,
    repoUrl: `https://github.com/${repo}`,
    state,
    updatedAt: item.updated_at,
  };
}

// Pull requests the user opened in repositories owned by someone else, from
// GitHub's public search. Search has a tighter rate limit than the rest of the
// API, so callers must show a failure as "could not load", never as "none".
export async function getExternalPullRequests(
  username: string
): Promise<ExternalPullRequestResult> {
  if (!USERNAME_PATTERN.test(username)) {
    throw new GitHubError('Invalid GitHub username', 400);
  }

  try {
    const { data } = await axios.get<{ total_count: number; items: SearchItem[] }>(
      `${API_CONFIG.GITHUB_API}/search/issues`,
      {
        timeout: 10000,
        headers: {
          ...API_CONFIG.HEADERS,
          ...(API_CONFIG.GITHUB_TOKEN && {
            Authorization: `token ${API_CONFIG.GITHUB_TOKEN}`,
          }),
        },
        params: {
          q: `type:pr author:${username} -user:${username}`,
          sort: 'updated',
          order: 'desc',
          per_page: EXTERNAL_PR_LIMIT,
        },
      }
    );
    return {
      items: data.items.map(toExternalPullRequest),
      totalCount: data.total_count,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new GitHubError(
        error.response?.data?.message || 'Failed to fetch pull requests',
        error.response?.status || 500
      );
    }
    throw new GitHubError('Failed to fetch pull requests', 500);
  }
}
