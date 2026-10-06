'use client';
import { useState } from 'react';
import { TryItLab } from '../../../../components/TryItLab';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';
import { useToroTransactions } from '@reactforge/react';

function TransactionsLab() {
  const [address, setAddress] = useState('');
  const [target, setTarget] = useState<string | undefined>(undefined);
  const { data, loading, error } = useToroTransactions(target);

  const codeSnippet = `import { useToroTransactions } from '@reactforge/react';

function TransactionHistory({ address }) {
  const { data, loading, error } = useToroTransactions(address, 20);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((tx) => (
        <li key={tx.hash}>{tx.hash} — {tx.value}</li>
      ))}
    </ul>
  );
}`;

  return (
    <TryItLab title="useToroTransactions" description="Fetch live transaction history for any address." codeSnippet={codeSnippet}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter wallet address..." className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 focus:ring-blue-400/30 transition-all text-sm" />
          <button onClick={() => setTarget(address)} disabled={!address} className="bg-[#16A34A] hover:opacity-90 disabled:opacity-50 px-8 py-2.5 rounded-lg text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">Fetch</button>
        </div>
        <div className="bg-black/50 rounded-xl p-4 border border-white/5 min-h-[160px]">
          {loading && <div className="text-indigo-400 animate-pulse text-sm text-center mt-4">Fetching transactions...</div>}
          {error && <div className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg">Error: {error.message}</div>}
          {data && !loading && (
            <div className="space-y-2">
              {Array.isArray(data) && data.length > 0 ? data.slice(0, 5).map((tx: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5 text-xs">
                  <span className="font-mono text-gray-400 truncate max-w-[180px]">{tx.hash || `tx-${i}`}</span>
                  <span className="text-[#16A34A]">{tx.value || 'N/A'}</span>
                </div>
              )) : <div className="text-gray-500 text-sm text-center mt-4">No transactions found.</div>}
            </div>
          )}
          {!target && !loading && <div className="text-gray-500 text-sm text-center mt-4">Enter an address to load transactions.</div>}
        </div>
      </div>
    </TryItLab>
  );
}

export default function UseToroTransactionsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroTransactions"
        description="Fetches paginated transaction history for a Toronet wallet address."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Returns transaction records from the Toronet blockchain for a given address in reverse chronological order, up to the specified <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">count</code>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use in wallet dashboards, activity feeds, and any transaction history view. Pair with <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">useToroBalance</code> for a complete wallet overview screen.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroTransactions } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Default</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">address</td><td className="py-3 font-mono text-sm text-[#16A34A]">string?</td><td className="py-3 text-gray-400 text-sm">activeAddress from ToroProvider</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">count</td><td className="py-3 font-mono text-sm text-[#16A34A]">number?</td><td className="py-3 text-gray-400 text-sm">20</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code="{ data: any[] | null, loading: boolean, error: Error | null, refetch: () => void }" language="typescript" />
      </section>

      <TransactionsLab />
    </div>
  );
}
