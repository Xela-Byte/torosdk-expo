import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreateWallet, useImportWallet, useDeleteWallet, useWallets } from 'torosdk-expo';
import type { RootStackParamList } from '../../App';

type CreateWalletNav = NativeStackNavigationProp<RootStackParamList, 'CreateWallet'>;

export default function CreateWalletScreen({ navigation }: { navigation: CreateWalletNav }) {
  const wallets = useWallets();
  const createWallet = useCreateWallet();
  const importWallet = useImportWallet();
  const deleteWallet = useDeleteWallet();
  const isPending = createWallet.isPending || importWallet.isPending || deleteWallet.isPending;

  const [mode, setMode] = useState<'create' | 'import'>('create');
  const [username, setUsername] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async () => {
    try {
      const address = await createWallet.mutateAsync({ username, password });
      Alert.alert('Wallet Created', `Address: ${address.slice(0, 14)}...\n\nNavigate back to Home to see your balances.`);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Unknown error');
    }
  };

  const handleImport = async () => {
    try {
      const address = await importWallet.mutateAsync({ privateKey, password });
      Alert.alert('Wallet Imported', `Address: ${address.slice(0, 14)}...\n\nNavigate back to Home to see your balances.`);
      setPrivateKey('');
      setPassword('');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Unknown error');
    }
  };

  const handleDelete = (address: string) => {
    Alert.alert('Delete Wallet', `Remove ${address.slice(0, 10)}...?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWallet.mutateAsync(address);
          } catch (err: any) {
            Alert.alert('Error', err?.message ?? 'Unknown error');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, mode === 'create' && styles.tabActive]}
          onPress={() => setMode('create')}
        >
          <Text style={[styles.tabText, mode === 'create' && styles.tabTextActive]}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'import' && styles.tabActive]}
          onPress={() => setMode('import')}
        >
          <Text style={[styles.tabText, mode === 'import' && styles.tabTextActive]}>Import</Text>
        </TouchableOpacity>
      </View>

      {mode === 'create' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={[styles.submitButton, isPending && styles.disabled]}
            onPress={handleCreate}
            disabled={isPending || !username || !password}
          >
            {createWallet.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Wallet</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Private Key (0x...)"
            placeholderTextColor="#666"
            value={privateKey}
            onChangeText={setPrivateKey}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={[styles.submitButton, isPending && styles.disabled]}
            onPress={handleImport}
            disabled={isPending || !privateKey || !password}
          >
            {importWallet.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Import Wallet</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* Existing wallets with delete */}
      {wallets.isLoading ? (
        <ActivityIndicator color="#e94560" style={{ marginTop: 32 }} />
      ) : wallets.error !== null ? (
        <View style={styles.existingSection}>
          <Text style={styles.sectionTitle}>Stored Wallets</Text>
          <Text style={styles.errorText}>{wallets.error ?? 'Failed to load'}</Text>
        </View>
      ) : wallets.all.length > 0 && (
        <View style={styles.existingSection}>
          <Text style={styles.sectionTitle}>Stored Wallets</Text>
          {wallets.all.map((addr) => (
            <View key={addr} style={styles.walletRow}>
              <Text style={styles.walletAddr}>{addr.slice(0, 10)}...{addr.slice(-6)}</Text>
              <TouchableOpacity onPress={() => handleDelete(addr)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  tabs: { flexDirection: 'row', marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#0f3460', borderRadius: 8, marginHorizontal: 4 },
  tabActive: { backgroundColor: '#e94560' },
  tabText: { color: '#aaa', fontWeight: 'bold' },
  tabTextActive: { color: '#fff' },
  input: { backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#e94560', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  existingSection: { marginTop: 32 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f3460', padding: 14, borderRadius: 8, marginBottom: 8 },
  walletAddr: { color: '#fff', fontSize: 14 },
  deleteText: { color: '#e94560', fontWeight: 'bold' },
  errorText: { color: '#e94560', marginTop: 8 },
});
