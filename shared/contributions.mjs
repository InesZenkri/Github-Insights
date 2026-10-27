/**
 * Shared core for fetching real GitHub contribution-calendar data.
 *
 * Used by the Netlify function (production) and the Vite dev middleware
 * (local development). No dependencies and no token: it reads the public
 * contribution calendar that GitHub serves at
 * https://github.com/users/<username>/contributions, so it only ever sees
 * public contribution data.
 */

export class ContributionError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ContributionError';
    this.status = status;
  }
}

const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

const CALENDAR_URL = (username) =>
  `https://github.com/users/${encodeURIComponent(username)}/contributions`;

/** Parse the contribution-calendar HTML into [{ date: 'YYYY-MM-DD', count }]. */
export function parseContributionCalendar(html) {
  const days = [];

  // Day cells: <td ... data-date="2025-10-26" id="contribution-day-component-0-0" ...>
  const cellRe = /<td\b[^>]*\bclass="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
  const tooltipRe =
    /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;

  const countsById = new Map();
  let tip;
  while ((tip = tooltipRe.exec(html)) !== null) {
    const text = tip[2].trim();
    const match = /^([\d,]+)\s+contribution/.exec(text);
    countsById.set(tip[1], match ? Number(match[1].replace(/,/g, '')) : 0);
  }

  let cell;
  while ((cell = cellRe.exec(html)) !== null) {
    const tag = cell[0];
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    if (!date || !id) continue;
    const count = countsById.get(id);
    if (count === undefined) continue;
    days.push({ date, count });
  }

  days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return days;
}

/**
 * Fetch the public contribution calendar for a GitHub username.
 * Returns { username, total, days } where days covers roughly the last year.
 * Throws ContributionError with an HTTP-ish status on failure.
 */
export async function getContributionsForUser(username) {
  if (!username || !USERNAME_RE.test(username)) {
    throw new ContributionError('A valid GitHub username is required', 400);
  }

  let response;
  try {
    response = await fetch(CALENDAR_URL(username), {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'github-insights-app (+https://github-insights.netlify.app)',
      },
      redirect: 'follow',
    });
  } catch {
    throw new ContributionError('Could not reach GitHub', 502);
  }

  if (response.status === 404) {
    throw new ContributionError(`GitHub user "${username}" was not found`, 404);
  }
  if (!response.ok) {
    throw new ContributionError(
      `GitHub responded with status ${response.status}`,
      502
    );
  }

  const html = await response.text();
  const days = parseContributionCalendar(html);
  if (days.length === 0) {
    throw new ContributionError(
      'Could not read the contribution calendar for this user',
      502
    );
  }

  const total = days.reduce((sum, day) => sum + day.count, 0);
  return { username, total, days };
}
