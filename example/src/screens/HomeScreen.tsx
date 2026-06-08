import React, { useLayoutEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWallets, useBalances } from 'torosdk-expo';
import { useAuth } from '../context/AuthGate';
import type { RootStackParamList } from '../../App';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: { navigation: HomeNav }) {
  const auth = useAuth();
  const wallets = useWallets();
  const balances = useBalances({
    address: wallets.active ?? '',
    enabled: !!wallets.active,
  });

  // Logout button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={auth.lock} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, auth.lock]);

  if (wallets.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#e94560" size={36} />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  if (wallets.error !== null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Wallet Error</Text>
        <Text style={styles.emptySubtitle}>
          {wallets.error ?? 'Could not load wallets'}
        </Text>
      </View>
    );
  }

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
        <View style={styles.walletCardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.walletLabel}>Active Wallet</Text>
            <Text style={styles.walletAddr} numberOfLines={1}>
              {wallets.active.slice(0, 14)}...{wallets.active.slice(-8)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate('CreateWallet')}
          >
            <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallet switcher / management */}
      <View style={styles.switcherSection}>
        <Text style={styles.sectionTitle}>Wallets</Text>
        {wallets.all.length <= 1 ? (
          <TouchableOpacity
            style={styles.addWalletButton}
            onPress={() => navigation.navigate('CreateWallet')}
          >
            <Text style={styles.addWalletText}>+ Add or switch wallet</Text>
          </TouchableOpacity>
        ) : (
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
            ListFooterComponent={
              <TouchableOpacity
                style={styles.manageChip}
                onPress={() => navigation.navigate('CreateWallet')}
              >
                <Text style={styles.manageChipText}>Manage</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>

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
              <Text style={styles.balanceAmount}>{b.balance || '0'}</Text>
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
  walletCardTop: { flexDirection: 'row', alignItems: 'center' },
  walletLabel: { color: '#aaa', fontSize: 12, textTransform: 'uppercase' },
  walletAddr: { color: '#4ecca3', fontSize: 16, fontWeight: 'bold', marginTop: 4, fontFamily: 'monospace' },
  manageButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  manageButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  switcherSection: { marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  addWalletButton: {
    backgroundColor: '#0f3460',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a5276',
    borderStyle: 'dashed' as any,
    alignItems: 'center',
  },
  addWalletText: { color: '#e94560', fontWeight: '600', fontSize: 14 },
  walletChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#0f3460', marginRight: 8 },
  walletChipActive: { backgroundColor: '#e94560' },
  walletChipText: { color: '#aaa', fontSize: 13, fontFamily: 'monospace' },
  walletChipTextActive: { color: '#fff' },
  manageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  manageChipText: { color: '#e94560', fontWeight: '600', fontSize: 13 },
  logoutButton: { paddingHorizontal: 8, paddingVertical: 4 },
  logoutText: { color: '#e94560', fontWeight: '600', fontSize: 14 },
  balanceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  balanceCard: { backgroundColor: '#0f3460', borderRadius: 10, padding: 14, width: '47%' as any, marginBottom: 4 },
  currencyLabel: { color: '#aaa', fontSize: 14 },
  balanceAmount: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  errorText: { color: '#e94560', textAlign: 'center', marginTop: 20 },
  loadingText: { color: '#aaa', marginTop: 12, fontSize: 14 },
});
