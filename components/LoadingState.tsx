import React from 'react';

export function LoadingState() {
  return (
    <div className="text-center terminal-text p-4 bg-[#24283b] rounded-lg">
      <div className="animate-pulse">
        <div className="h-4 bg-[#1a1b26] rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-[#1a1b26] rounded w-1/2 mx-auto"></div>
      </div>
      <p className="mt-4">Loading... Please wait while we fetch your GitHub data...</p>
    </div>
  );
}