'use client';
import { useState } from 'react';
// Note: We would import a useToroTransactionStatus hook here once it's built in @reactforge/react
// For now we'll mock the UI structure for the debugger

export default function TransactionDebuggerPage() {
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    
    // Simulating SDK fetch for the UI
    setTimeout(() => {
      if (hash.length < 10) {
        setError("Invalid transaction hash length");
        setResult(null);
      } else {
        setResult({
          status: 'Success',
          block: '12849021',
          from: '0xabc123...',
          to: '0xdef456...',
          value: '150 ToroG',
          receipt: 'Confirmed',
          events: 'Transfer(from, to, value)',
          errorReason: null
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[#16A34A]">Transaction Debugger</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Inspect raw transaction data directly from the Toronet blockchain. Enter a transaction hash below to view status, block details, and revert reasons.
      </p>

      <div className="bg-[#151515] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter Transaction Hash (e.g., 0x...)" 
            className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all font-mono text-sm"
          />
          <button 
            onClick={handleInspect}
            disabled={loading || !hash}
            className="bg-[#16A34A] hover:opacity-90 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]"
          >
            {loading ? 'Inspecting...' : 'Inspect'}
          </button>
        </div>

        {error && (
          <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm mb-6 animate-in slide-in-from-top-2">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
          <div className="bg-[#111] px-6 py-3 border-b border-white/5 font-medium text-gray-300">
            Transaction Details
          </div>
          
          {result ? (
            <div className="p-6">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400 w-1/4">Status</td>
                    <td className="py-3 font-mono text-green-400">{result.status}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400">Block</td>
                    <td className="py-3 font-mono text-gray-200">{result.block}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400">From</td>
                    <td className="py-3 font-mono text-gray-200">{result.from}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400">To</td>
                    <td className="py-3 font-mono text-gray-200">{result.to}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400">Value</td>
                    <td className="py-3 font-mono text-[#16A34A]">{result.value}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400">Receipt</td>
                    <td className="py-3 font-mono text-gray-200">{result.receipt}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-gray-400">Events</td>
                    <td className="py-3 font-mono text-purple-300">{result.events}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-400">Error/Revert reason</td>
                    <td className="py-3 font-mono text-gray-500">{result.errorReason || 'None'}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="mt-8 p-4 bg-[#16A34A]/10 border border-[#16A34A]/50 rounded-lg">
                <p className="text-sm text-[#16A34A] font-mono">
                  Related Toolkit Operation: <code className="bg-black/50 px-2 py-1 rounded">useToroTransactionStatus()</code>
                </p>
              </div>
            </div>
          ) : (
             <div className="p-12 text-center text-gray-600 text-sm">
              No transaction data to display. Please enter a hash and click Inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
