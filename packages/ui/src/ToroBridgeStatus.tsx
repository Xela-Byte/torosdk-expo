import React from 'react';
import { useToroBridgeBalance } from '@reactforge/react';
import { BridgeNetwork, formatToroAmount } from '@reactforge/sdk-adapter';

export interface ToroBridgeStatusProps {
  address?: string;
  className?: string;
}

export const ToroBridgeStatus: React.FC<ToroBridgeStatusProps> = ({ address, className = '' }) => {
  // Using fixed admin credentials for display purposes; in production, route through backend
  const { balance: solBalance, loading: solLoading } = useToroBridgeBalance(BridgeNetwork.Solana, address);
  const { balance: baseBalance, loading: baseLoading } = useToroBridgeBalance(BridgeNetwork.Base, address);
  const { balance: polyBalance, loading: polyLoading } = useToroBridgeBalance(BridgeNetwork.Polygon, address);
  const { balance: bscBalance, loading: bscLoading } = useToroBridgeBalance(BridgeNetwork.BSC, address);
  const { balance: arbBalance, loading: arbLoading } = useToroBridgeBalance(BridgeNetwork.Arbitrum, address);

  const chains = [
    { name: 'Solana', loading: solLoading, balance: solBalance },
    { name: 'Base', loading: baseLoading, balance: baseBalance },
    { name: 'Polygon', loading: polyLoading, balance: polyBalance },
    { name: 'BSC', loading: bscLoading, balance: bscBalance },
    { name: 'Arbitrum', loading: arbLoading, balance: arbBalance },
  ];

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span>🌉</span> Bridge Balances
      </h3>
      <div className="grid gap-2">
        {chains.map((chain) => (
          <div key={chain.name} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
            <span className="text-sm text-gray-600 font-medium">{chain.name}</span>
            <div className="text-sm">
              {chain.loading ? (
                <span className="text-gray-400 animate-pulse">Loading...</span>
              ) : chain.balance ? (
                <span className="font-mono text-gray-900">{formatToroAmount(chain.balance)} TORO</span>
              ) : (
                <span className="text-gray-400">---</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
