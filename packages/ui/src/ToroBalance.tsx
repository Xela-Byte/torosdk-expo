import React from 'react';
import { useToroBalance } from '@reactforge/react';
import { formatToroCurrency } from '@reactforge/sdk-adapter';

export interface ToroBalanceProps {
  address?: string;
  className?: string;
  showAll?: boolean;
}

export const ToroBalance: React.FC<ToroBalanceProps> = ({ address, className = '', showAll = false }) => {
  const { data, loading, error } = useToroBalance(address);

  if (loading) return <div className={`animate-pulse bg-gray-200 h-10 w-48 rounded ${className}`} />;
  if (error) return <div className={`text-red-500 text-sm ${className}`}>Error loading balance</div>;
  if (!data) return <div className={`text-gray-500 text-sm ${className}`}>No balance data</div>;

  return (
    <div className={`flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-white ${className}`}>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Balances</h3>
      <div className="flex justify-between items-center">
        <span className="text-gray-700">ToroG</span>
        <span className="font-medium">{formatToroCurrency(data.toroGBalance, 'TORO')}</span>
      </div>
      {(showAll || parseFloat(data.ngnBalance) > 0) && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">NGN</span>
          <span>{formatToroCurrency(data.ngnBalance, 'NGN')}</span>
        </div>
      )}
      {(showAll || parseFloat(data.usdBalance) > 0) && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">USD</span>
          <span>{formatToroCurrency(data.usdBalance, 'USD')}</span>
        </div>
      )}
      {(showAll || parseFloat(data.kshBalance) > 0) && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">KSH</span>
          <span>{formatToroCurrency(data.kshBalance, 'KSH')}</span>
        </div>
      )}
    </div>
  );
};
