'use client';
import { useState } from 'react';
import { TryItLab } from '../../../../components/TryItLab';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';
import { useToroBalance, useToroContext } from '@reactforge/react';

function BalanceLab() {
  const { setActiveAddress } = useToroContext();
  const [addressInput, setAddressInput] = useState('');
  const [testAddress, setTestAddress] = useState<string | undefined>(undefined);
  const { data, loading, error, refetch } = useToroBalance(testAddress);

  const handleTest = () => {
    setActiveAddress(addressInput);
    setTestAddress(addressInput);
    refetch();
  };

  const codeSnippet = `import { useToroBalance } from '@reactforge/react';

function BalanceDashboard({ address }) {
  const { data, loading, error, refetch } = useToroBalance(address);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>NGN Balance: {data?.ngnBalance}</p>
      <p>USD Balance: {data?.usdBalance}</p>
      <p>ToroG Balance: {data?.toroGBalance}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`;

  return (
    <TryItLab title="useToroBalance" description="Check real testnet balances instantly." codeSnippet={codeSnippet}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Toronet address..."
            className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all text-sm"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
          <button
            onClick={handleTest}
            className="bg-[#16A34A] hover:opacity-90 text-white px-8 py-2.5 rounded-lg font-medium transition-all text-sm shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]"
          >
            Fetch Balance
          </button>
        </div>

        <div className="bg-black/50 rounded-xl p-6 border border-white/5 min-h-[150px] flex flex-col justify-center">
          {loading && <div className="text-center text-[#16A34A] animate-pulse">Fetching from Toronet...</div>}
          {error && <div className="text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20 text-sm"><strong>Error:</strong> {error.message}</div>}
          {data && !loading && (
            <div className="grid grid-cols-3 gap-4">
              {[['NGN', data.ngnBalance], ['USD', data.usdBalance], ['ToroG', data.toroGBalance]].map(([label, val]) => (
                <div key={label} className="bg-gradient-to-b from-white/5 to-transparent p-4 rounded-lg border border-white/10 text-center">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-2xl font-bold text-white">{val}</div>
                </div>
              ))}
            </div>
          )}
          {!data && !loading && !error && <div className="text-center text-gray-500 text-sm">Enter an address and click fetch.</div>}
        </div>
      </div>
    </TryItLab>
  );
}

export default function UseToroBalancePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroBalance"
        description="Fetches and normalizes Toronet currency balances (NGN, USD, ToroG) for a wallet address."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Calls the Toronet balance API and normalizes the response into consistent string values for NGN, USD, and ToroG — handling all raw field mapping internally.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use this hook anytime you need to display user balances in a dashboard, or before executing a payment to ensure sufficient funds.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroBalance } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Description</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">address</td><td className="py-3 font-mono text-sm text-[#16A34A]">string?</td><td className="py-3 text-gray-400 text-sm">Wallet address. Falls back to global activeAddress from ToroProvider.</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  data: { ngnBalance: string, usdBalance: string, toroGBalance: string } | null,
  loading: boolean,
  error: ToroError | null,
  refetch: () => Promise<void>
}`} language="typescript" />
      </section>

      <BalanceLab />
    </div>
  );
}
