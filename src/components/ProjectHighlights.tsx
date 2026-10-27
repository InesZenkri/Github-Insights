import React from 'react';
import { FolderGit2, Star } from 'lucide-react';
import { Repository } from '../types/github';
import { pickHighlights } from '../utils/projectHighlights';
import { formatPushDate } from '../utils/projectHighlights';

interface ProjectHighlightsProps {
  repos: Repository[];
}

export function ProjectHighlights({ repos }: ProjectHighlightsProps) {
  const highlights = pickHighlights(repos);

  return (
    <div className="bg-[#24283b] rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <FolderGit2 className="text-purple-400" />
        <h3 className="terminal-text font-medium">Projects to open first</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Public repositories owned by this user, without forks or archived repositories, ordered by
        stars and then by latest push. This only helps decide what to look at first. It does not
        rate the quality of the work, and private work is not shown.
      </p>

      {highlights.length === 0 && (
        <p className="text-sm">No public, non-fork repositories were found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {highlights.map((repo) => (
          <div key={repo.full_name} className="bg-[#1a1b26] rounded p-3 text-sm">
            <div className="flex items-center justify-between">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7aa2f7] underline font-medium"
              >
                {repo.name}
              </a>
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Star size={12} /> {repo.stargazers_count}
              </span>
            </div>
            {repo.description && <p className="text-gray-300 mt-1">{repo.description}</p>}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
              {repo.language && <span>{repo.language}</span>}
              {repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION' && (
                <span>License: {repo.license.spdx_id}</span>
              )}
              <span>last pushed {formatPushDate(repo.pushed_at)}</span>
            </div>
            {repo.topics && repo.topics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {repo.topics.slice(0, 5).map((topic) => (
                  <span key={topic} className="px-2 py-0.5 rounded bg-[#24283b] text-xs">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
