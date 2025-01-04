import React from 'react';
import { Users } from 'lucide-react';
import { useQuery } from 'react-query';
import { getVisitorCount } from '../services/visitors';

interface VisitorCounterProps {
  username: string;
}

export function VisitorCounter({ username }: VisitorCounterProps) {
  const { data: visitorCount } = useQuery(
    ['visitors', username],
    () => getVisitorCount(username),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Only fetch once per session
      retry: 2,
      initialData: 1
    }
  );

  return (
    <div className="flex items-center space-x-2 text-[#7aa2f7]">
      <Users size={16} />
      <span>{visitorCount?.toLocaleString() || '1'} profile views</span>
    </div>
  );
}