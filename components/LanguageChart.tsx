import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Code } from 'lucide-react';

interface LanguageChartProps {
  languages: { language: string; count: number }[];
}

export function LanguageChart({ languages }: LanguageChartProps) {
  return (
    <div className="bg-[#24283b] rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Code className="text-green-400" />
        <h3 className="terminal-text font-medium">Most Used Languages</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={languages}>
            <XAxis dataKey="language" stroke="#a9b1d6" />
            <YAxis stroke="#a9b1d6" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #30365F' }}
              labelStyle={{ color: '#a9b1d6' }}
            />
            <Bar dataKey="count" fill="#7aa2f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}