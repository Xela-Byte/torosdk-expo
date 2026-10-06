'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNUseBalancesPage() {
  const codeSnippet = `import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useWallets, useBalances } from '@reactforge/react-native';

export function PortfolioScreen() {
  const { activeWallet } = useWallets();
  const { data: balances, isLoading, isRefetching, refetch } = useBalances(activeWallet ?? undefined);

  if (!activeWallet) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No active wallet found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Portfolio</Text>
      
      {isLoading ? (
        <ActivityIndicator color="#16A34A" />
      ) : (
        <FlatList
          data={balances}
          keyExtractor={(item) => item.currency}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.currencyName}>{item.currency}</Text>
              <Text style={styles.balance}>{item.balance}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: '#a1a1aa' },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#1f1f1f', 
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#0a0a0a'
  },
  currencyName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  balance: { color: '#16A34A', fontSize: 16, fontWeight: 'bold' }
});`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useBalances" 
        description="Fetch all supported fiat and digital currency balances for a wallet in parallel." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          While <code className="text-[#16A34A]">useBalance</code> fetches a single currency, <code className="text-[#16A34A]">useBalances</code> executes parallel queries to fetch the balance of <strong>all natively supported Toronet currencies</strong> (TORO, USD, EUR, Naira, etc.) simultaneously. This is ideal for building portfolio or dashboard screens.
        </p>

        <TryItLab 
          title="Building a Portfolio View"
          description="A FlatList rendering all wallet balances with pull-to-refresh capabilities."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Under the Hood</h2>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Parallel Queries:</b> It utilizes TanStack Query's <code className="text-white">useQueries</code> hook to fetch all balances concurrently, drastically reducing loading times compared to sequential requests.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Graceful Degradation:</b> If one currency query fails, the others will still resolve successfully.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Performance:</b> React Native's bridge won't be blocked by heavy JSON parsing since the SDK uses an optimized Hermes network adapter for RPC calls.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
