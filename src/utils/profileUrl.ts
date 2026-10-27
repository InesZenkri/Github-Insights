// GitHub usernames: 1-39 characters, letters, digits and single hyphens,
// not starting or ending with a hyphen.
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function isValidUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
}

// Reads ?user=<name> from a query string. Returns '' when it is missing or
// is not a valid GitHub username.
export function getUsernameFromSearch(search: string): string {
  const value = new URLSearchParams(search).get('user')?.trim() ?? '';
  return isValidUsername(value) ? value : '';
}

export function buildProfileUrl(origin: string, pathname: string, username: string): string {
  return `${origin}${pathname}?user=${encodeURIComponent(username)}`;
}
