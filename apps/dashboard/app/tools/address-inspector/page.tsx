'use client';
import { useState } from 'react';
import { useToroBalance, useToroContext } from '@reactforge/react';
// We'd also import useToroTNSLookup, useToroTransactions once built

export default function AddressInspectorPage() {
  const [address, setAddress] = useState('');
  const [inspectAddress, setInspectAddress] = useState<string | undefined>(undefined);
  
  // Reuse the balance hook we already built!
  const { data: balanceData, loading: balanceLoading } = useToroBalance(inspectAddress);

  const handleInspect = () => {
    if (!address) return;
    setInspectAddress(address);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[#16A34A]">Address Inspector</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        View supported public information about a Toronet address, including TNS, balances, and recent transaction history.
      </p>

      <div className="bg-[#151515] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Wallet Address (e.g., 0x...)" 
            className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all font-mono text-sm"
          />
          <button 
            onClick={handleInspect}
            disabled={!address}
            className="bg-[#16A34A] hover:opacity-90 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]"
          >
            Inspect
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TNS Card */}
          <div className="bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
            <div className="bg-[#111] px-6 py-3 border-b border-white/5 font-medium text-gray-300">
              Identity (TNS)
            </div>
            <div className="p-6 flex flex-col items-center justify-center min-h-[120px]">
              {inspectAddress ? (
                <div className="text-center">
                  <div className="text-indigo-400 font-bold text-xl mb-1">@mock_user</div>
                  <div className="text-gray-500 text-xs font-mono">{inspectAddress}</div>
                </div>
              ) : (
                <div className="text-gray-600 text-sm">No address inspected</div>
              )}
            </div>
          </div>

          {/* Balances Card */}
          <div className="bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
            <div className="bg-[#111] px-6 py-3 border-b border-white/5 font-medium text-gray-300">
              Balances
            </div>
            <div className="p-6 min-h-[120px] flex items-center justify-center">
              {!inspectAddress ? (
                <div className="text-gray-600 text-sm">No address inspected</div>
              ) : balanceLoading ? (
                <div className="text-indigo-400 animate-pulse text-sm">Loading balances...</div>
              ) : balanceData ? (
                <div className="w-full grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-gray-500 text-xs">NGN</div>
                    <div className="text-white font-medium">{balanceData.ngnBalance}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">USD</div>
                    <div className="text-white font-medium">{balanceData.usdBalance}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">ToroG</div>
                    <div className="text-white font-medium">{balanceData.toroGBalance}</div>
                  </div>
                </div>
              ) : (
                <div className="text-red-400 text-sm">Failed to load balances</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions List (Mocked for now) */}
        <div className="mt-6 bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
          <div className="bg-[#111] px-6 py-3 border-b border-white/5 font-medium text-gray-300">
            Recent Transactions
          </div>
          <div className="p-6">
             {!inspectAddress ? (
                <div className="text-gray-600 text-sm text-center py-4">No address inspected</div>
              ) : (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <div className="text-white text-sm font-medium">Transfer OUT</div>
                        <div className="text-gray-500 text-xs font-mono">0xabc...{i}123</div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-400 font-mono text-sm">-50.00 ToroG</div>
                        <div className="text-gray-500 text-xs">2 mins ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

      </div>
    </div>
  );
}
