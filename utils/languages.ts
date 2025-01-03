import { Repository } from '../types/github';
import axios from 'axios';
import { sanitizeData } from './sanitize';

export async function getRepositoryLanguages(username: string): Promise<{ language: string; count: number }[]> {
  try {
    const { data } = await axios.get<Repository[]>(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );
    
    const languages = data.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return sanitizeData(
      Object.entries(languages)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository languages');
    }
    throw error;
  }
}