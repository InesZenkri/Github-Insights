import { GitHubError } from '../utils/errors';

const VISITOR_API_BASE = 'https://api.countapi.xyz/hit';

export async function getVisitorCount(username: string): Promise<number> {
  if (!username) {
    throw new GitHubError('Username is required', 400);
  }

  try {
    // Use a simpler namespace format and ensure it's URL-safe
    const namespace = encodeURIComponent(`ghstats-${username.toLowerCase()}`);
    const response = await fetch(`${VISITOR_API_BASE}/${namespace}/visits`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch visitor count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Visitor count error:', error);
    return 1; // Return 1 as fallback to ensure counter is visible
  }
}