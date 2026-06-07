import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useKYCStatus, useWallets } from 'torosdk-expo';

export default function KYCScreen() {
  const wallets = useWallets();
  const [checkAddress, setCheckAddress] = useState(wallets.active ?? '');

  const kyc = useKYCStatus({
    address: checkAddress,
    enabled: !!checkAddress,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wallet Address</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="0x..."
          placeholderTextColor="#666"
          value={checkAddress}
          onChangeText={setCheckAddress}
        />
        <TouchableOpacity
          style={styles.useActiveButton}
          onPress={() => wallets.active && setCheckAddress(wallets.active)}
        >
          <Text style={styles.useActiveText}>Use Active</Text>
        </TouchableOpacity>
      </View>

      {kyc.isLoading ? (
        <ActivityIndicator color="#e94560" style={{ marginTop: 20 }} />
      ) : kyc.data ? (
        <View style={styles.resultCard}>
          <View style={[
            styles.statusDot,
            { backgroundColor: kyc.data.verified ? '#4ecca3' : '#e94560' },
          ]} />
          <Text style={styles.statusText}>
            {kyc.data.verified ? 'KYC Verified' : 'Not Verified'}
          </Text>
        </View>
      ) : null}

      {kyc.isError && (
        <Text style={styles.errorText}>{(kyc.error as Error)?.message}</Text>
      )}

      <Text style={styles.infoText}>
        Enter any wallet address to check its KYC verification status on Toronet.
        {!wallets.active && '\n\nCreate or import a wallet first to use your own address.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  label: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 12, fontSize: 14 },
  useActiveButton: { backgroundColor: '#0f3460', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8, justifyContent: 'center' },
  useActiveText: { color: '#e94560', fontWeight: 'bold', fontSize: 13 },
  resultCard: { flexDirection: 'row', alignItems: 'center', marginTop: 24, backgroundColor: '#0f3460', padding: 20, borderRadius: 12 },
  statusDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  statusText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#e94560', marginTop: 12 },
  infoText: { color: '#666', fontSize: 13, marginTop: 24, textAlign: 'center', lineHeight: 20 },
});
