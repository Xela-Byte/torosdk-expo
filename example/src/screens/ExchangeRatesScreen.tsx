import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useExchangeRates } from 'torosdk-expo';

export default function ExchangeRatesScreen() {
  const { data: rates, isLoading, isError, error, refetch } = useExchangeRates();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{(error as Error)?.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Live Exchange Rates</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rates ?? []}
        keyExtractor={(item) => item.pair}
        renderItem={({ item }) => (
          <View style={styles.rateRow}>
            <Text style={styles.pair}>{item.pair}</Text>
            <Text style={styles.rate}>{item.rate.toFixed(6)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No rates available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  refreshText: { color: '#e94560', fontWeight: 'bold' },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  pair: { color: '#fff', fontSize: 16, fontWeight: '600' },
  rate: { color: '#4ecca3', fontSize: 16, fontFamily: 'monospace' },
  errorText: { color: '#e94560', marginBottom: 16 },
  retryButton: { backgroundColor: '#e94560', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 },
});
