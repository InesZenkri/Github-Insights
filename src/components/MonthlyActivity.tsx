import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { Contribution } from '../types/github';
import { aggregateByMonth } from '../utils/monthlyActivity';

interface MonthlyActivityProps {
  days: Contribution[];
}

export function MonthlyActivity({ days }: MonthlyActivityProps) {
  const months = aggregateByMonth(days);
  const activeMonths = months.filter((m) => m.count > 0).length;

  return (
    <div className="bg-[#24283b] rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Activity className="text-orange-400" />
        <h3 className="terminal-text font-medium">Activity by month</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Contributions per month from the public contribution calendar on the GitHub profile, with
        contributions in {activeMonths} of the {months.length} months shown. The first and last
        month can be partial. GitHub shows private-repository contributions only as anonymous
        counts, and only if the user turned that setting on. Commits made with an email that is not
        linked to the account, and work outside GitHub, are not included. A quiet month does not
        mean no work.
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months}>
            <XAxis dataKey="month" stroke="#a9b1d6" tick={{ fontSize: 11 }} />
            <YAxis stroke="#a9b1d6" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #30365F' }}
              labelStyle={{ color: '#a9b1d6' }}
              formatter={(value: number, _name, item) => [
                `${value}${item.payload.partial ? ` (partial month, ${item.payload.days} days)` : ''}`,
                'Contributions',
              ]}
            />
            <Bar dataKey="count" fill="#e0af68" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
