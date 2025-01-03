export class GitHubError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof GitHubError) {
    switch (error.status) {
      case 401:
        return 'GitHub API authentication failed. Please check your token.';
      case 403:
        return 'GitHub API rate limit exceeded. Please try again later.';
      case 404:
        return 'GitHub user not found. Please check the username and try again.';
      case 500:
        return 'GitHub API is experiencing issues. Please try again later.';
      default:
        return error.message || 'Failed to fetch GitHub data';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}