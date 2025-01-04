export const API_CONFIG = {
  GITHUB_API: 'https://api.github.com',
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  CACHE_TIME: 300000, // 5 minutes
  RETRY_COUNT: 1,
  HEADERS: {
    Accept: 'application/vnd.github.v3+json',
  },
} as const;