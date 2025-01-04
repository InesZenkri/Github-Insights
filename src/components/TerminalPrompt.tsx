import React from 'react';
import { Terminal } from 'lucide-react';

interface TerminalPromptProps {
  onSearch: (username: string) => void;
}

export function TerminalPrompt({ onSearch }: TerminalPromptProps) {
  const [command, setCommand] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.startsWith('gh user')) {
      const username = command.replace('gh user', '').trim();
      if (username) {
        onSearch(username);
      }
    }
  };

  return (
    <div className="terminal-window w-full max-w-3xl mx-auto">
      <div className="terminal-header p-2 flex items-center space-x-2">
        <div className="terminal-circle bg-red-500"></div>
        <div className="terminal-circle bg-yellow-500"></div>
        <div className="terminal-circle bg-green-500"></div>
        <span className="ml-4 text-sm text-gray-400">GitHub Terminal</span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-2">
          <Terminal size={20} className="text-blue-400" />
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="gh user <username>"
            className="flex-1 bg-transparent border-none outline-none terminal-text"
            spellCheck="false"
          />
        </div>
      </form>
    </div>
  );
}