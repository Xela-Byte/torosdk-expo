'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';
import { CodeBlock } from '@/components/CodeBlock';

export default function RNUseTransferPage() {
  const codeSnippet = `import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useWallets, useTransfer, Currency } from '@reactforge/react-native';

export function SendFundsScreen() {
  const { activeWallet } = useWallets();
  const transfer = useTransfer();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('10.50');

  const handleSend = () => {
    if (!activeWallet) return;

    // 1. Initiates the transfer
    // 2. Halts and shows Biometric prompt (if configured in authStrategy)
    // 3. Resolves secure password from Keystore on success
    // 4. Signs and submits to blockchain
    transfer.mutate(
      {
        sender: activeWallet,
        receiver: recipient,
        amount,
        currency: Currency.Toro,
      },
      {
        onSuccess: (res) => {
          Alert.alert('Success', \`Tx Hash: \${res.transactionHash}\`);
          setRecipient('');
          setAmount('');
        },
        onError: (err) => {
          Alert.alert('Transfer Failed', err.message);
        }
      }
    );
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#000', flex: 1 }}>
      <TextInput 
        placeholder="Recipient TNS or Address"
        placeholderTextColor="#52525b"
        value={recipient} 
        onChangeText={setRecipient} 
        style={{ borderWidth: 1, borderColor: '#1f1f1f', color: '#fff', padding: 12, marginBottom: 12, borderRadius: 6 }}
      />
      <TextInput 
        placeholder="Amount"
        placeholderTextColor="#52525b"
        value={amount} 
        onChangeText={setAmount} 
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, borderColor: '#1f1f1f', color: '#fff', padding: 12, marginBottom: 16, borderRadius: 6 }}
      />
      
      {transfer.isPending ? (
        <View style={{ padding: 12 }}>
          <ActivityIndicator color="#16A34A" />
        </View>
      ) : (
        <Button 
          title="Send Funds" 
          color="#16A34A" 
          onPress={handleSend} 
          disabled={!recipient || !amount || !activeWallet}
        />
      )}
    </View>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useTransfer" 
        description="Execute secure inter-wallet transfers with built-in biometric auth gating and cache invalidation." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useTransfer</code> hook is a powerful React Native mutation that handles the entire transaction lifecycle. Crucially, it intercepts the call to execute your app's configured <code className="text-white">authStrategy</code> (such as prompting for Face ID or a custom PIN) before securely signing the transaction using credentials retrieved from the hardware keychain.
        </p>

        <TryItLab 
          title="Sending Funds"
          description="A complete transfer form with biometric gating and loading states."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Why use the SDK for transfers?</h2>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">1.</span>
            <span><b>Zero-knowledge signing:</b> Your UI never touches the user's password. The SDK securely reads it from <code className="text-white">expo-secure-store</code> strictly at the moment of signing.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">2.</span>
            <span><b>TNS Resolution:</b> You can pass a raw address (<code className="text-white">0x123...</code>) or a TNS username (<code className="text-white">alice</code>) into the <code className="text-white">receiver</code> field. The SDK resolves it automatically.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">3.</span>
            <span><b>Auto-Invalidation:</b> Upon a successful transfer, the SDK automatically tells React Query to refetch all balances and transaction history for the <code className="text-white">sender</code> wallet, ensuring UI consistency without manual boilerplate.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
