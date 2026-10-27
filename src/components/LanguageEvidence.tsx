import React, { useState } from 'react';
import { Code, Star } from 'lucide-react';
import { Repository } from '../types/github';
import { formatPushDate, groupReposByLanguage } from '../utils/languageEvidence';

interface LanguageEvidenceProps {
  repos: Repository[];
}

export function LanguageEvidence({ repos }: LanguageEvidenceProps) {
  const [includeForks, setIncludeForks] = useState(false);
  const groups = groupReposByLanguage(repos, includeForks);
  const mayBeIncomplete = repos.length >= 100;

  return (
    <div className="bg-[#24283b] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Code className="text-green-400" />
          <h3 className="terminal-text font-medium">Languages and the projects behind them</h3>
        </div>
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeForks}
            onChange={(e) => setIncludeForks(e.target.checked)}
          />
          Include forks
        </label>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Each repository is counted under the primary language GitHub reports for it. This shows
        what is in public repositories, not how skilled someone is. Forks are left out unless
        ticked, so counts can differ from the chart above, which includes forks. Work that is private or
        outside GitHub is not shown here.
        {mayBeIncomplete && ' Only the 100 most recently updated repositories were fetched, so the list may be incomplete.'}
      </p>

      {groups.length === 0 && (
        <p className="text-sm">No public repositories with a detected language were found.</p>
      )}

      <div className="space-y-2">
        {groups.map((group) => (
          <details key={group.language} className="bg-[#1a1b26] rounded p-3">
            <summary className="cursor-pointer terminal-text">
              {group.language}{' '}
              <span className="text-gray-400">
                ({group.repos.length} {group.repos.length === 1 ? 'repository' : 'repositories'})
              </span>
            </summary>
            <ul className="mt-3 space-y-2">
              {group.repos.map((repo) => (
                <li key={repo.full_name} className="text-sm">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7aa2f7] underline"
                  >
                    {repo.name}
                  </a>
                  {repo.fork && <span className="ml-2 text-xs text-gray-400">fork</span>}
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-400">
                    <Star size={12} /> {repo.stargazers_count}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    last pushed {formatPushDate(repo.pushed_at)}
                  </span>
                  {repo.description && <p className="text-gray-300">{repo.description}</p>}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
