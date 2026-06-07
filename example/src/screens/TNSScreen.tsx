import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useResolveTNS, useLookupTNS, useSetTNS, useWallets } from 'torosdk-expo';

export default function TNSScreen() {
  const wallets = useWallets();
  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [resolveName, setResolveName] = useState('');
  const [lookupAddr, setLookupAddr] = useState('');
  const [registerName, setRegisterName] = useState('');

  const resolve = useResolveTNS(resolveName, !!resolveName);
  const lookup = useLookupTNS(lookupAddr, !!lookupAddr);
  const setTNS = useSetTNS();

  const handleRegister = async () => {
    if (!wallets.active) return;
    try {
      await setTNS.mutateAsync({ address: wallets.active, name: registerName });
      setRegisterName('');
    } catch (err: any) {
      // Error surfaced via setTNS.isError
    }
  };

  return (
    <View style={styles.container}>
      {/* Resolve */}
      <Text style={styles.sectionTitle}>Resolve Name → Address</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="name.toronet"
          placeholderTextColor="#666"
          value={resolveName}
          onChangeText={setResolveName}
        />
      </View>
      {resolve.isFetching && <ActivityIndicator color="#e94560" />}
      {resolve.isError && <Text style={styles.errorText}>{(resolve.error as Error)?.message}</Text>}
      {resolve.data && <Text style={styles.result}>{resolve.data}</Text>}

      {/* Lookup */}
      <Text style={styles.sectionTitle}>Lookup Address → Name</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="0x..."
          placeholderTextColor="#666"
          value={lookupAddr}
          onChangeText={setLookupAddr}
        />
      </View>
      {lookup.isFetching && <ActivityIndicator color="#e94560" />}
      {lookup.isError && <Text style={styles.errorText}>{(lookup.error as Error)?.message}</Text>}
      {lookup.data && <Text style={styles.result}>{lookup.data}</Text>}

      {/* Register */}
      <Text style={styles.sectionTitle}>Register Name (uses active wallet)</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="your-name.toronet"
          placeholderTextColor="#666"
          value={registerName}
          onChangeText={setRegisterName}
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={setTNS.isPending || !registerName}
        >
          {setTNS.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.registerText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
      {setTNS.isError && (
        <Text style={styles.errorText}>{(setTNS.error as Error)?.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 12, fontSize: 14 },
  result: { color: '#4ecca3', fontSize: 16, marginTop: 8, fontFamily: 'monospace' },
  registerButton: { backgroundColor: '#e94560', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, justifyContent: 'center' },
  registerText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: '#e94560', marginTop: 8 },
});
