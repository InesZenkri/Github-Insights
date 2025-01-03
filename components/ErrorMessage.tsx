import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center terminal-error mb-8 p-4 bg-[#24283b] rounded-lg border border-red-500">
      <span className="text-red-500">Error:</span> {message}
    </div>
  );
}