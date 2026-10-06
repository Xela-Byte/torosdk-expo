import React from 'react';
import { useToroContext } from '@reactforge/react';
import { shortenAddress } from '@reactforge/sdk-adapter';

export interface ToroWalletProps {
  className?: string;
}

export const ToroWallet: React.FC<ToroWalletProps> = ({ className = '' }) => {
  const { activeAddress, setActiveAddress } = useToroContext();

  if (!activeAddress) {
    return (
      <div className={`p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 ${className}`}>
        No active wallet connected. Use <code>useToroContext().connectWallet()</code> to set one up.
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg bg-gray-50 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
          W
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Connected Wallet</span>
          <span className="text-sm font-mono font-medium text-gray-900">{shortenAddress(activeAddress, 8, 6)}</span>
        </div>
      </div>
      <button 
        onClick={() => setActiveAddress(null)}
        className="text-xs text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};
