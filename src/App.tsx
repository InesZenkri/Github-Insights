import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { getUser, getRepositories, getContributions } from './services/github';
import { Header } from './components/Header';
import { TerminalPrompt } from './components/TerminalPrompt';
import { StatsCard } from './components/StatsCard';
import { ShareButtons } from './components/ShareButtons';
import { LoadingState } from './components/LoadingState';
import { ErrorMessage } from './components/ErrorMessage';
import { getErrorMessage } from './utils/errors';
import { ProfileLink } from './components/ProfileLink';
import { buildProfileUrl, getUsernameFromSearch } from './utils/profileUrl';

function App() {
  const [username, setUsername] = useState(() => getUsernameFromSearch(window.location.search));
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: userData, isLoading: isLoadingUser, error: userError } = useQuery(
    ['user', username],
    () => getUser(username),
    { enabled: !!username }
  );

  const { data: reposData, error: reposError } = useQuery(
    ['repos', username],
    () => getRepositories(username),
    { enabled: !!username }
  );

  const { data: contributionsData, isLoading: isLoadingContributions, error: contributionsError } = useQuery(
    ['contributions', username],
    () => getContributions(username),
    { enabled: !!username }
  );

  const error = userError || reposError || contributionsError;
  const isLoading = isLoadingUser || isLoadingContributions;

  const handleSearch = (searchUsername: string) => {
    setUsername(searchUsername);
    // Keep the address bar in sync so the current profile can be shared.
    window.history.replaceState(
      null,
      '',
      buildProfileUrl('', window.location.pathname, searchUsername)
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1b26] text-[#a9b1d6] p-4">
      <div className="container mx-auto px-4 py-12">
        <Header />

        <div className="mb-12">
          <TerminalPrompt onSearch={handleSearch} />
        </div>

        {error && (
          <ErrorMessage message={getErrorMessage(error)} />
        )}

        {isLoading && <LoadingState />}

        {userData && contributionsData && reposData && (
          <div className="space-y-8" ref={statsRef}>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-20 h-20 rounded-full border-4 border-[#7aa2f7]"
              />
              <div>
                <h2 className="text-2xl font-bold text-[#e0af68]">{userData.name}</h2>
                <p className="terminal-text">@{userData.login}</p>
              </div>
            </div>

            <ProfileLink
              url={buildProfileUrl(window.location.origin, window.location.pathname, username)}
            />

            <StatsCard 
              stats={contributionsData} 
              repos={reposData} 
              username={username} 
            />

            <div className="flex justify-center mt-8">
              <ShareButtons targetRef={statsRef} username={username} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
