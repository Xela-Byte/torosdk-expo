import React from 'react';
import { useToroTokenBalance } from '@reactforge/react';

export interface ToroTokenBalanceProps {
  address?: string;
  className?: string;
}

export const ToroTokenBalance: React.FC<ToroTokenBalanceProps> = ({ address, className = '' }) => {
  const { data, loading, error } = useToroTokenBalance(address);

  if (loading) return <div className={`animate-pulse bg-gray-200 h-10 w-48 rounded ${className}`} />;
  if (error) return <div className={`text-red-500 text-sm ${className}`}>Error loading token balance</div>;
  if (!data) return null;

  return (
    <div className={`flex items-center gap-2 p-3 border rounded-lg bg-gray-50 ${className}`}>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900">
          {data.balance} <span className="text-sm font-normal text-gray-500">{data.symbol || 'TOROG'}</span>
        </span>
        {data.name && <span className="text-xs text-gray-400">{data.name}</span>}
      </div>
    </div>
  );
};
