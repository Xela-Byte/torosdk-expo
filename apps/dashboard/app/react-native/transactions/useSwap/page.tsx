'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNUseSwapPage() {
  const codeSnippet = `import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useWallets, useSwap, Currency } from '@reactforge/react-native';

export function SwapScreen() {
  const { activeWallet } = useWallets();
  const swap = useSwap();
  
  const [amount, setAmount] = useState('50');

  const handleSwap = () => {
    if (!activeWallet) return;

    swap.mutate(
      {
        address: activeWallet,
        sourceCurrency: Currency.USD,
        targetCurrency: Currency.Toro,
        amount,
      },
      {
        onSuccess: (res) => {
          Alert.alert('Swap Successful', \`Tx Hash: \${res.transactionHash}\`);
        },
        onError: (err) => {
          Alert.alert('Swap Failed', err.message);
        }
      }
    );
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#000', flex: 1 }}>
      <TextInput 
        placeholder="Amount in USD to Swap"
        placeholderTextColor="#52525b"
        value={amount} 
        onChangeText={setAmount} 
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, borderColor: '#1f1f1f', color: '#fff', padding: 12, marginBottom: 16, borderRadius: 6 }}
      />
      
      {swap.isPending ? (
        <ActivityIndicator color="#16A34A" />
      ) : (
        <Button 
          title="Swap USD for TORO" 
          color="#16A34A" 
          onPress={handleSwap} 
          disabled={!amount || !activeWallet}
        />
      )}
    </View>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useSwap" 
        description="Execute instant atomic currency swaps on Toronet with biometric authorization." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useSwap</code> mutation allows users to exchange one supported Toronet currency for another instantly at the current network exchange rate. Just like transfers, it respects the globally configured <code className="text-white">authStrategy</code>, prompting the user for Face ID or Fingerprint before proceeding.
        </p>

        <TryItLab 
          title="Atomic Currency Swap"
          description="A complete UI for swapping USD to TORO securely on mobile."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Cache Invalidation</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Upon a successful swap, the React Native SDK automatically invalidates the cache for <code className="text-[#16A34A]">useBalance</code>, <code className="text-[#16A34A]">useBalances</code>, and <code className="text-[#16A34A]">useTransactions</code>. This ensures that the UI instantly reflects the deducted source currency and the credited target currency without requiring a manual refresh.
        </p>
      </section>
    </div>
  );
}
