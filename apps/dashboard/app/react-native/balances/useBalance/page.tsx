'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNUseBalancePage() {
  const codeSnippet = `import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useWallets, useBalance, Currency } from '@reactforge/react-native';

export function SingleBalanceScreen() {
  // 1. Get the globally active wallet address from hardware storage
  const { activeWallet } = useWallets();

  // 2. Fetch balance with auto-polling and reactive caching
  const { data: balance, isLoading, error } = useBalance(
    activeWallet ?? undefined,
    Currency.Toro // e.g., 'TORO', 'Naira', 'USD'
  );

  if (!activeWallet) {
    return <Text style={{ color: '#a1a1aa' }}>Please create or import a wallet first.</Text>;
  }

  return (
    <View style={{ padding: 20, backgroundColor: '#000', flex: 1 }}>
      <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>
        Wallet: {activeWallet.slice(0, 8)}...
      </Text>
      
      {isLoading ? (
        <ActivityIndicator color="#16A34A" />
      ) : error ? (
        <Text style={{ color: 'red' }}>Error fetching balance: {error.message}</Text>
      ) : (
        <Text style={{ color: '#16A34A', fontSize: 24, fontWeight: 'bold' }}>
          {balance?.balance} {balance?.currency}
        </Text>
      )}
    </View>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useBalance" 
        description="Query the real-time balance of a specific currency for an address on Toronet." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useBalance</code> hook provides a reactive way to fetch the balance of a single fiat or digital currency. It leverages React Query under the hood, meaning balances are automatically cached, de-duplicated, and invalidated when a transfer or swap mutation occurs.
        </p>

        <TryItLab 
          title="Fetching a Single Balance"
          description="A complete example showing how to fetch the TORO balance for the active wallet."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Parameters</h2>
        <div className="overflow-x-auto border border-[#1f1f1f] rounded-lg bg-black">
          <table className="w-full text-left text-sm text-[#a1a1aa]">
            <thead className="bg-[#0a0a0a] text-[#52525b] uppercase text-[10px] tracking-wider border-b border-[#1f1f1f]">
              <tr>
                <th className="px-4 py-3 font-semibold">Parameter</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              <tr>
                <td className="px-4 py-3 font-mono text-[#16A34A]">address</td>
                <td className="px-4 py-3 font-mono text-white text-xs">string | undefined</td>
                <td className="px-4 py-3">The wallet address to query. If undefined, the query is paused.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-[#16A34A]">currency</td>
                <td className="px-4 py-3 font-mono text-white text-xs">Currency</td>
                <td className="px-4 py-3">The target currency to fetch (e.g., <code className="text-white">Currency.Toro</code>, <code className="text-white">Currency.USD</code>).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-[#16A34A]">options</td>
                <td className="px-4 py-3 font-mono text-white text-xs">QueryOptions (optional)</td>
                <td className="px-4 py-3">Standard TanStack Query options like <code className="text-white">refetchInterval</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Cache Invalidation</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Because the SDK is tightly integrated with <code className="text-white">@tanstack/react-query</code>, you rarely need to refetch balances manually. Whenever you successfully call <code className="text-[#16A34A]">useTransfer</code> or <code className="text-[#16A34A]">useSwap</code>, the SDK automatically marks all balance queries matching that address as stale, triggering an immediate background refetch.
        </p>
      </section>
    </div>
  );
}
