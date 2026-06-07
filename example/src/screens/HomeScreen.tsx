import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useWallets, useBalances } from 'torosdk-expo';

export default function HomeScreen({ navigation }: any) {
  const wallets = useWallets();
  const balances = useBalances({
    address: wallets.active ?? '',
    enabled: !!wallets.active,
  });

  if (!wallets.active) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No Wallet Connected</Text>
        <Text style={styles.emptySubtitle}>
          Create or import a wallet to get started
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('CreateWallet')}
        >
          <Text style={styles.ctaText}>Create / Import Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Active wallet display */}
      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Active Wallet</Text>
        <Text style={styles.walletAddr} numberOfLines={1}>
          {wallets.active.slice(0, 14)}...{wallets.active.slice(-8)}
        </Text>
      </View>

      {/* Wallet switcher */}
      {wallets.all.length > 1 && (
        <View style={styles.switcherSection}>
          <Text style={styles.sectionTitle}>Switch Wallet</Text>
          <FlatList
            horizontal
            data={wallets.all}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.walletChip,
                  item === wallets.active && styles.walletChipActive,
                ]}
                onPress={() => wallets.switchWallet(item)}
              >
                <Text
                  style={[
                    styles.walletChipText,
                    item === wallets.active && styles.walletChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.slice(0, 8)}...
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Balances */}
      <Text style={styles.sectionTitle}>Balances</Text>
      {balances.isLoading ? (
        <ActivityIndicator color="#e94560" style={{ marginTop: 20 }} />
      ) : balances.isError ? (
        <Text style={styles.errorText}>
          Error loading balances
        </Text>
      ) : (
        <View style={styles.balanceGrid}>
          {balances.data?.map((b) => (
            <View key={b.currency} style={styles.balanceCard}>
              <Text style={styles.currencyLabel}>{b.currency}</Text>
              <Text style={styles.balanceAmount}>{b.balance}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e', padding: 32 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  ctaButton: { backgroundColor: '#e94560', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  walletCard: { backgroundColor: '#0f3460', padding: 16, borderRadius: 12, marginBottom: 16 },
  walletLabel: { color: '#aaa', fontSize: 12, textTransform: 'uppercase' },
  walletAddr: { color: '#4ecca3', fontSize: 16, fontWeight: 'bold', marginTop: 4, fontFamily: 'monospace' },
  switcherSection: { marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  walletChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#0f3460', marginRight: 8 },
  walletChipActive: { backgroundColor: '#e94560' },
  walletChipText: { color: '#aaa', fontSize: 13, fontFamily: 'monospace' },
  walletChipTextActive: { color: '#fff' },
  balanceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  balanceCard: { backgroundColor: '#0f3460', borderRadius: 10, padding: 14, width: '47%' as any, marginBottom: 4 },
  currencyLabel: { color: '#aaa', fontSize: 14 },
  balanceAmount: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  errorText: { color: '#e94560', textAlign: 'center', marginTop: 20 },
});
