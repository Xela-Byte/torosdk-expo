'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNUseTransactionsPage() {
  const codeSnippet = `import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useWallets, useTransactions } from '@reactforge/react-native';

export function LedgerScreen() {
  const { activeWallet } = useWallets();
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch paginated transaction history
  const { data: transactions, isLoading, isRefetching, refetch } = useTransactions(
    activeWallet ?? undefined,
    { page, limit }
  );

  const renderItem = ({ item }) => {
    const isSender = item.sender === activeWallet;
    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.action}>{isSender ? 'Sent' : 'Received'}</Text>
          <Text style={styles.address}>
            {isSender ? \`To: \${item.receiver}\` : \`From: \${item.sender}\`}
          </Text>
        </View>
        <Text style={[styles.amount, { color: isSender ? '#ef4444' : '#16A34A' }]}>
          {isSender ? '-' : '+'}{item.amount} {item.currency}
        </Text>
      </View>
    );
  };

  if (!activeWallet) return null;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color="#16A34A" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(tx) => tx.transactionHash}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: '#1f1f1f', 
  },
  action: { color: '#fff', fontSize: 16, fontWeight: '500' },
  address: { color: '#71717a', fontSize: 12, marginTop: 4 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  empty: { color: '#71717a', textAlign: 'center', marginTop: 40 }
});`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useTransactions" 
        description="Fetch paginated transaction ledger history for a Toronet address." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useTransactions</code> hook queries the on-chain ledger to retrieve a historical list of transfers and operations involving the specified address. It supports pagination and automatically updates when new transactions are executed locally.
        </p>

        <TryItLab 
          title="Transaction History View"
          description="A FlatList rendering the ledger, color-coding sent vs received funds."
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
                <td className="px-4 py-3 font-mono text-[#16A34A]">pagination</td>
                <td className="px-4 py-3 font-mono text-white text-xs">{`{ page?: number, limit?: number }`}</td>
                <td className="px-4 py-3">Control the subset of ledger items returned. Defaults to <code className="text-white">page: 1, limit: 100</code>.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-[#16A34A]">options</td>
                <td className="px-4 py-3 font-mono text-white text-xs">QueryOptions (optional)</td>
                <td className="px-4 py-3">Standard TanStack Query options.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
