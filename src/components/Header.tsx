import React from 'react';
import { Terminal } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-4">
        <Terminal size={64} className="text-[#7aa2f7]" />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-[#e0af68]">GitHub Terminal Stats</h1>
      <p className="text-[#9ece6a] text-lg">
        $ echo "Analyze your GitHub journey through the terminal"
      </p>
    </div>
  );
}