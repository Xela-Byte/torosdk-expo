'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';
import { CodeBlock } from '@/components/CodeBlock';

export default function RNUseCreateWalletPage() {
  const codeSnippet = `import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useCreateWallet } from '@reactforge/react-native';

export function CreateWalletScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const createWallet = useCreateWallet();

  const handleCreate = () => {
    createWallet.mutate(
      { username, password },
      {
        onSuccess: (address) => {
          Alert.alert('Success!', \`Wallet created: \${address}\`);
        },
        onError: (err) => {
          Alert.alert('Error', err.message);
        }
      }
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput 
        placeholder="TNS Username" 
        value={username} 
        onChangeText={setUsername} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput 
        placeholder="Secure Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      {createWallet.isPending ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Create Wallet" onPress={handleCreate} />
      )}
    </View>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useCreateWallet" 
        description="Create a new Toronet wallet and persist encrypted credentials to SecureStore automatically." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useCreateWallet</code> mutation handles the heavy lifting of generating an ECDSA keypair, registering the wallet on the blockchain, booking the Toronet Name Service (TNS) username, and saving the password securely inside the device's hardware keychain.
        </p>

        <TryItLab 
          title="Create Wallet Flow"
          description="React Native component handling wallet creation."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Under the Hood</h2>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">•</span>
            <span>If the user is on an iOS device, <code className="text-white">expo-secure-store</code> uses the <b>iOS Keychain</b>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">•</span>
            <span>If the user is on Android, it leverages the <b>Android Keystore</b>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">•</span>
            <span>When the wallet is created, it is automatically set as the <code className="text-white">activeWallet</code> globally.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
