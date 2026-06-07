import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useTransfer, useBalance, useWallets } from 'torosdk-expo';
import { Currency } from 'torosdk-expo/core';

const CURRENCIES: Currency[] = [
  Currency.Naira,
  Currency.Dollar,
  Currency.Kenyan_Shilling,
  Currency.South_African_Rand,
  Currency.Pound,
  Currency.Euro,
];

export default function TransferScreen() {
  const wallets = useWallets();
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.Naira);

  const transfer = useTransfer();
  const balance = useBalance({
    address: wallets.active ?? '',
    currency,
    enabled: !!wallets.active,
  });

  const handleSend = async () => {
    if (!wallets.active) {
      Alert.alert('Error', 'No active wallet');
      return;
    }
    try {
      const result = await transfer.mutateAsync({
        senderAddress: wallets.active,
        receiverAddress: receiver,
        amount,
        currency,
      });
      Alert.alert('Sent!', `Transaction: ${JSON.stringify(result)}`);
      setReceiver('');
      setAmount('');
    } catch (err: any) {
      Alert.alert('Transfer Failed', err?.message ?? 'Unknown error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Balance display */}
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Balance:</Text>
        <Text style={styles.balanceValue}>
          {balance.data?.balance ?? '...'} {currency}
        </Text>
      </View>

      {/* Currency picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyBar}>
        {CURRENCIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.currencyChip, currency === c && styles.currencyChipActive]}
            onPress={() => setCurrency(c)}
          >
            <Text style={[styles.currencyText, currency === c && styles.currencyTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Receiver Address (0x...)"
        placeholderTextColor="#666"
        value={receiver}
        onChangeText={setReceiver}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#666"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[styles.sendButton, transfer.isPending && styles.disabled]}
        onPress={handleSend}
        disabled={transfer.isPending || !receiver || !amount}
      >
        {transfer.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendText}>Send {currency}</Text>
        )}
      </TouchableOpacity>

      {transfer.isError && (
        <Text style={styles.errorText}>
          Error: {(transfer.error as Error)?.message}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, backgroundColor: '#0f3460', padding: 16, borderRadius: 8 },
  balanceLabel: { color: '#aaa', fontSize: 16 },
  balanceValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  currencyBar: { marginBottom: 16 },
  currencyChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0f3460', marginRight: 8 },
  currencyChipActive: { backgroundColor: '#e94560' },
  currencyText: { color: '#aaa', fontWeight: 'bold' },
  currencyTextActive: { color: '#fff' },
  input: { backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  sendButton: { backgroundColor: '#e94560', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  errorText: { color: '#e94560', marginTop: 12 },
});
