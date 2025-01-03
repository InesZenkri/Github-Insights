import React from 'react';
import { Users } from 'lucide-react';
import { useQuery } from 'react-query';

interface VisitorCounterProps {
  username: string;
}

export function VisitorCounter({ username }: VisitorCounterProps) {
  const { data: visitorCount } = useQuery(
    ['visitors', username],
    async () => {
      // Using a free visitor counter service
      const response = await fetch(`https://api.countapi.xyz/hit/github-stats-${username}/visits`);
      const data = await response.json();
      return data.value;
    },
    { initialData: 1 }
  );

  return (
    <div className="flex items-center space-x-2 text-[#7aa2f7]">
      <Users size={16} />
      <span>{visitorCount.toLocaleString()} profile views</span>
    </div>
  );
}