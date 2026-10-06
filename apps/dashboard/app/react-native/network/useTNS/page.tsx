'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNUseTNSPage() {
  const codeSnippet = `import React, { useState } from 'react';
import { View, TextInput, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useTNS } from '@reactforge/react-native';

export function TNSScreen() {
  const tns = useTNS();
  
  const [username, setUsername] = useState('alice');
  const [address, setAddress] = useState('');

  const handleResolve = () => {
    tns.resolve.mutate(username, {
      onSuccess: (res) => setAddress(res.address),
      onError: () => setAddress('Not found')
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Resolve Username to Address</Text>
      <TextInput 
        placeholder="Enter username"
        placeholderTextColor="#52525b"
        value={username} 
        onChangeText={setUsername} 
        style={styles.input}
        autoCapitalize="none"
      />
      
      {tns.resolve.isPending ? (
        <ActivityIndicator color="#16A34A" />
      ) : (
        <Button title="Resolve" color="#16A34A" onPress={handleResolve} />
      )}

      {address ? (
        <Text style={styles.result}>Resolved: {address}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#000', flex: 1 },
  label: { color: '#a1a1aa', marginBottom: 8, fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#1f1f1f', color: '#fff', padding: 12, marginBottom: 16, borderRadius: 6 },
  result: { color: '#16A34A', marginTop: 16, fontSize: 16, fontWeight: 'bold' }
});`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useTNS" 
        description="Interact with the Toronet Name Service to resolve usernames to addresses." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The Toronet Name Service (TNS) replaces long hexadecimal addresses with readable usernames. The <code className="text-[#16A34A]">useTNS</code> hook exposes mutations and queries to resolve usernames to addresses, find the username associated with an address, and register new names.
        </p>

        <TryItLab 
          title="Resolving TNS Usernames"
          description="Resolve a username string into its underlying 0x address."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Methods</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <h3 className="text-white font-medium text-sm font-mono text-[#16A34A] mb-2">
              tns.resolve.mutate(username)
            </h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Returns the Toronet address associated with the provided username string.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <h3 className="text-white font-medium text-sm font-mono text-[#16A34A] mb-2">
              tns.lookup.mutate(address)
            </h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Reverse resolution: Returns the registered username for a given Toronet address.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <h3 className="text-white font-medium text-sm font-mono text-[#16A34A] mb-2">
              tns.register.mutate({`{ address, username }`})
            </h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Binds a new username to an address on-chain. Requires administrative rights or available TNS booking slots on the specific Toronet network.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
