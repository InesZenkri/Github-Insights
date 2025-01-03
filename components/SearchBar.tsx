import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (username: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="w-full px-6 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-xl 
                   text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                   transition-colors"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500
                   transition-colors"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
}