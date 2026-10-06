'use client';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function RNIntroductionPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="React Native & Expo SDK" 
        description="Build secure, production-grade mobile Toronet applications on iOS and Android." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-6 text-sm leading-relaxed">
          The <code className="text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded font-mono">@reactforge/react-native</code> SDK brings the full power of the Toronet blockchain to mobile devices. Built on top of <code className="text-white">@reactforge/sdk-adapter</code> and powered by <code className="text-white">@tanstack/react-query</code>, it offers reactive hooks, hardware-backed credential storage, biometric authentication gating, and robust error handling tailored for mobile operating systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              🔒
            </div>
            <h3 className="text-white font-medium text-base mb-1">Hardware Keychain Security</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Never expose private keys or passwords in plain text. Stored credentials map automatically to the iOS Keychain and Android Keystore via <code className="text-[#a1a1aa]">expo-secure-store</code>.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              👆
            </div>
            <h3 className="text-white font-medium text-base mb-1">Biometric Authentication</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Gated actions (transfers, swaps, wallet deletions) require Face ID or Fingerprint confirmation before resolving credentials from secure storage.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              ⚡
            </div>
            <h3 className="text-white font-medium text-base mb-1">Reactive Query Layer</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Built on TanStack React Query with smart caching, background polling, and automated cache invalidation upon successful transactions.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              📱
            </div>
            <h3 className="text-white font-medium text-base mb-1">Hermes Network Adapter</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Standardized HTTP transport resolving React Native Hermes engine quirks for Toronet RPC calls with zero manual polyfills required.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Quick Example</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Here is a complete setup wrapping your application with <code className="text-[#16A34A]">ToronetProvider</code> and configuring Face ID / Fingerprint gating:
        </p>
        <CodeBlock 
          code={`import React from 'react';
import { View, Text, Button } from 'react-native';
import { ToronetProvider, useWallets, useBalances } from '@reactforge/react-native';
import { createBiometricStrategy } from '@reactforge/react-native/core';

// Configure biometric prompt for sensitive actions
const authStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'swap', 'wallet-delete'],
  skipFor: ['balance', 'exchange-rates'],
});

function WalletDashboard() {
  const { activeWallet } = useWallets();
  const { data: balances, isLoading } = useBalances(activeWallet ?? undefined);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>
        Active Wallet: {activeWallet ?? 'No wallet selected'}
      </Text>
      {isLoading ? (
        <Text style={{ color: '#a1a1aa' }}>Fetching balances...</Text>
      ) : (
        balances?.map((b) => (
          <Text key={b.currency} style={{ color: '#16A34A', fontSize: 16 }}>
            {b.currency}: {b.balance}
          </Text>
        ))
      )}
    </View>
  );
}

export default function App() {
  return (
    <ToronetProvider config={{ network: 'testnet' }} authStrategy={authStrategy}>
      <WalletDashboard />
    </ToronetProvider>
  );
}`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-white">Explore React Native Docs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link 
            href="/react-native/installation" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              Installation &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Peer dependencies, Expo configuration, and provider setup.
            </p>
          </Link>

          <Link 
            href="/react-native/wallet/auth-strategies" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              Biometric Auth Strategies &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Configure Face ID, Touch ID, and hardware storage policies.
            </p>
          </Link>

          <Link 
            href="/react-native/wallet/useWallets" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              useWallets &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Manage saved wallets, active session, and switching accounts.
            </p>
          </Link>

          <Link 
            href="/react-native/transactions/useTransfer" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              useTransfer &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Perform secure mobile transfers with automatic cache invalidation.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
