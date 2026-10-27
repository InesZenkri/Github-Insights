import React from 'react';
import { GitPullRequest } from 'lucide-react';
import { ExternalPullRequest, ExternalPullRequestResult } from '../types/github';

interface OpenSourceContributionsProps {
  username: string;
  data?: ExternalPullRequestResult;
  isLoading: boolean;
  error: unknown;
}

const STATE_LABEL = {
  merged: { text: 'merged', className: 'text-purple-400' },
  open: { text: 'open', className: 'text-green-400' },
  closed: { text: 'closed, not merged', className: 'text-gray-400' },
} as const;

function groupByRepo(items: ExternalPullRequest[]) {
  const groups = new Map<string, ExternalPullRequest[]>();
  for (const item of items) {
    groups.set(item.repo, [...(groups.get(item.repo) ?? []), item]);
  }
  return Array.from(groups, ([repo, prs]) => ({ repo, repoUrl: prs[0].repoUrl, prs }));
}

export function OpenSourceContributions({
  username,
  data,
  isLoading,
  error,
}: OpenSourceContributionsProps) {
  return (
    <div className="bg-[#24283b] rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <GitPullRequest className="text-blue-400" />
        <h3 className="terminal-text font-medium">Pull requests to other people's projects</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Public pull requests opened by @{username} in repositories they do not own. A project listed
        here is not something @{username} built. Each link goes to the pull request itself.
      </p>

      {isLoading && <p className="text-sm">Loading pull requests...</p>}

      {!isLoading && error != null && (
        <p className="text-sm text-yellow-300">
          Could not load pull requests (GitHub search may be rate limited). This does not mean there
          are none. Try again in a minute.
        </p>
      )}

      {!isLoading && !error && data && data.items.length === 0 && (
        <p className="text-sm">No public pull requests to other users' repositories were found.</p>
      )}

      {!isLoading && !error && data && data.items.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-3">
            Showing the {data.items.length} most recently updated of {data.totalCount}.
          </p>
          <div className="space-y-3">
            {groupByRepo(data.items).map((group) => (
              <div key={group.repo} className="bg-[#1a1b26] rounded p-3 text-sm">
                <a
                  href={group.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7aa2f7] underline font-medium break-all"
                >
                  {group.repo}
                </a>
                <ul className="mt-2 space-y-1">
                  {group.prs.map((pr) => (
                    <li key={pr.url}>
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {pr.title}
                      </a>{' '}
                      <span className={`text-xs ${STATE_LABEL[pr.state].className}`}>
                        {STATE_LABEL[pr.state].text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
