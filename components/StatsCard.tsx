import React from 'react';
import { UserStats } from '../types/github';
import { Calendar, Award, Flame, Code, GitBranch, Star, GitFork } from 'lucide-react';
import { StatBox } from './StatBox';
import { LanguageChart } from './LanguageChart';
import { VisitorCounter } from './VisitorCounter';
import { Watermark } from './Watermark';

interface StatsCardProps {
  stats: UserStats;
  repos: any[];
  username: string;
}

export function StatsCard({ stats, repos, username }: StatsCardProps) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  return (
    <div className="terminal-window space-y-6 p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-[#e0af68]">GitHub Statistics</h2>
        <VisitorCounter username={username} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox
          icon={<Calendar className="text-blue-400" />}
          label="Total Contributions"
          value={stats.totalContributions}
        />
        <StatBox
          icon={<Award className="text-yellow-400" />}
          label="Longest Streak"
          value={`${stats.longestStreak} days`}
        />
        <StatBox
          icon={<Flame className="text-orange-400" />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
        />
        <StatBox
          icon={<GitBranch className="text-purple-400" />}
          label="Repositories"
          value={repos.length}
        />
        <StatBox
          icon={<Star className="text-yellow-400" />}
          label="Total Stars"
          value={totalStars}
        />
        <StatBox
          icon={<GitFork className="text-green-400" />}
          label="Total Forks"
          value={totalForks}
        />
      </div>

      <LanguageChart languages={stats.mostUsedLanguages} />
      <Watermark />
    </div>
  );
}