import {
  ContributionError,
  getContributionsForUser,
} from '../../shared/contributions.mjs';

/**
 * GET /api/contributions?username=<github-username>
 *
 * Returns real public contribution data for the given GitHub user:
 * { username, total, days: [{ date: 'YYYY-MM-DD', count }] }.
 * No token is used or exposed; the data comes from the public
 * contribution calendar GitHub serves for every user.
 */
function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export default async (req) => {
  const username = new URL(req.url).searchParams.get('username') ?? '';

  try {
    const result = await getContributionsForUser(username);
    return json(result, 200, { 'Cache-Control': 'public, max-age=300' });
  } catch (error) {
    if (error instanceof ContributionError) {
      return json({ error: error.message }, error.status);
    }
    return json(
      { error: 'Unexpected error while fetching contributions' },
      500
    );
  }
};

export const config = { path: '/api/contributions' };
