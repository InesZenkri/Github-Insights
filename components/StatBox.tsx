import React from 'react';

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export function StatBox({ icon, label, value }: StatBoxProps) {
  return (
    <div className="bg-[#24283b] rounded-lg p-4 glow-effect">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="terminal-text font-medium">{label}</h3>
      </div>
      <p className="text-2xl font-bold terminal-output mt-2">{value}</p>
    </div>
  );
}