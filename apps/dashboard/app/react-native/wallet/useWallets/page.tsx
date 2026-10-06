'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNUseWalletsPage() {
  const codeSnippet = `import React from 'react';
import { View, Text, Button } from 'react-native';
import { useWallets } from '@reactforge/react-native';

export function WalletSwitcher() {
  const { 
    wallets, 
    activeWallet, 
    setActiveWallet, 
    logout 
  } = useWallets();

  if (wallets.length === 0) {
    return <Text>No wallets imported or created yet.</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Active Wallet: {activeWallet ?? 'None'}
      </Text>
      
      {wallets.map((address) => (
        <Button 
          key={address} 
          title={\`Switch to \${address.slice(0, 6)}...\`} 
          onPress={() => setActiveWallet(address)} 
        />
      ))}

      <Button title="Logout" color="red" onPress={() => logout()} />
    </View>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useWallets" 
        description="Read stored wallet addresses, get the active wallet, and switch between them." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useWallets</code> hook is the core of state management for your app. It syncs directly with the persistent storage array on the device and gives you reactive access to the user's current session.
        </p>

        <TryItLab 
          title="Switching Active Wallets"
          description="Example of listing all wallets and selecting an active one."
          codeSnippet={codeSnippet}
        />
      </section>
    </div>
  );
}
