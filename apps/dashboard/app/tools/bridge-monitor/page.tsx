'use client';
import { useState } from 'react';

export default function BridgeMonitorPage() {
  const [txHash, setTxHash] = useState('');
  const [monitorResult, setMonitorResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMonitor = () => {
    if (!txHash) return;
    setLoading(true);
    
    // Simulate SDK bridge check
    setTimeout(() => {
      setMonitorResult({
        sourceChain: 'Polygon',
        destChain: 'Toronet',
        status: 'Processing',
        sourceTx: txHash,
        destTx: 'Pending confirmation...',
        amount: '1,500 USDC',
        estimatedTime: '~2 mins remaining'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[#16A34A]">Bridge Monitor</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Inspect cross-chain bridge activity. Enter a source transaction hash to view its bridging status into the Toronet ecosystem.
      </p>

      <div className="bg-[#151515] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Enter Source Chain Tx Hash (e.g., 0x...)" 
            className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all font-mono text-sm"
          />
          <button 
            onClick={handleMonitor}
            disabled={!txHash || loading}
            className="bg-[#16A34A] hover:opacity-90 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]"
          >
            {loading ? 'Scanning...' : 'Monitor'}
          </button>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
          <div className="bg-[#111] px-6 py-3 border-b border-white/5 font-medium text-gray-300">
            Bridge Status
          </div>
          <div className="p-6">
            {!monitorResult ? (
              <div className="text-center text-gray-600 text-sm py-8">
                No bridge transaction to display. Please enter a source hash.
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                
                {/* Visual Status Pipeline */}
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 border-2 border-blue-500 flex items-center justify-center mb-2">
                      <span className="text-[#16A34A] text-sm font-bold">1</span>
                    </div>
                    <span className="text-sm text-gray-300">{monitorResult.sourceChain}</span>
                  </div>
                  
                  <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-4 rounded-full opacity-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-white/40 animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-900/50 border-2 border-purple-500 flex items-center justify-center mb-2 animate-pulse">
                      <span className="text-purple-400 text-sm font-bold">2</span>
                    </div>
                    <span className="text-sm text-purple-300">Bridging...</span>
                  </div>

                  <div className="flex-1 h-1 bg-white/10 mx-4 rounded-full" />

                  <div className="flex flex-col items-center opacity-50">
                    <div className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center mb-2">
                      <span className="text-gray-500 text-sm font-bold">3</span>
                    </div>
                    <span className="text-sm text-gray-500">{monitorResult.destChain}</span>
                  </div>
                </div>

                {/* Details Table */}
                <table className="w-full text-left border-collapse mt-8">
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-gray-400 w-1/4">Status</td>
                      <td className="py-3 font-mono text-purple-400">{monitorResult.status}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-gray-400">Amount</td>
                      <td className="py-3 font-mono text-green-300">{monitorResult.amount}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-gray-400">Source Tx</td>
                      <td className="py-3 font-mono text-gray-300">{monitorResult.sourceTx}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-gray-400">Destination Tx</td>
                      <td className="py-3 font-mono text-gray-500 italic">{monitorResult.destTx}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-400">ETA</td>
                      <td className="py-3 font-mono text-orange-300">{monitorResult.estimatedTime}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
