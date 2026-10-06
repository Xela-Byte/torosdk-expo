'use client';
import { useState } from 'react';
import { TryItLab } from '../../../../components/TryItLab';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';
import { useToroTokenBalance } from '@reactforge/react';

function TokenBalanceLab() {
  const [address, setAddress] = useState('');
  const [target, setTarget] = useState<string | undefined>(undefined);
  const { data, loading, error } = useToroTokenBalance(target);

  const codeSnippet = `import { useToroTokenBalance } from '@reactforge/react';

function TokenDashboard({ address }) {
  const { data, loading } = useToroTokenBalance(address);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>{data?.name} ({data?.symbol})</h2>
      <p>Balance: {data?.balance}</p>
      <p>Decimals: {data?.decimals}</p>
    </div>
  );
}`;

  return (
    <TryItLab title="useToroTokenBalance" description="Fetch real ToroG token balance and metadata." codeSnippet={codeSnippet}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter wallet address..." className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all text-sm" />
          <button onClick={() => setTarget(address)} disabled={!address} className="bg-[#16A34A] hover:opacity-90 disabled:opacity-50 px-8 py-2.5 rounded-lg text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">Fetch</button>
        </div>
        <div className="bg-black/50 rounded-xl p-6 border border-white/5 min-h-[120px] flex items-center justify-center">
          {loading && <div className="text-indigo-400 animate-pulse text-sm">Fetching token data...</div>}
          {error && <div className="text-red-400 text-sm">Error: {error.message}</div>}
          {data && !loading && (
            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="text-center p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                <div className="text-xs text-gray-400 mb-1">Token</div>
                <div className="text-white font-bold">{data.name}</div>
                <div className="text-indigo-400 text-xs">{data.symbol}</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 mb-1">Balance</div>
                <div className="text-2xl font-bold text-white">{data.balance}</div>
                <div className="text-gray-500 text-xs">Decimals: {data.decimals}</div>
              </div>
            </div>
          )}
          {!target && !loading && <div className="text-gray-500 text-sm">Enter an address to fetch token data.</div>}
        </div>
      </div>
    </TryItLab>
  );
}

export default function UseToroTokenBalancePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroTokenBalance"
        description="Fetches the ToroG (TORO) token balance and metadata for a wallet address."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Fetches the ToroG token balance alongside the token's name, symbol, and decimals — all in a single call using <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">Promise.all</code>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use in token dashboards or anywhere you need to display the user's TORO token balance with proper formatting based on decimals.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroTokenBalance } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  data: {
    balance: string,
    name: string,
    symbol: string,
    decimals: number
  } | null,
  loading: boolean,
  error: Error | null,
  refetch: () => void
}`} language="typescript" />
      </section>

      <TokenBalanceLab />
    </div>
  );
}
