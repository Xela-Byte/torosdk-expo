'use client';
import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function RNInstallationPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Installation & Setup" 
        description="Get up and running with the React Native & Expo SDK." 
      />

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">1. Install Dependencies</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The React Native SDK requires a few peer dependencies like TanStack Query for robust caching, and Expo SecureStore for hardware-backed credential storage.
        </p>
        <CodeBlock 
          code="npm install @reactforge/react-native @reactforge/sdk-adapter @tanstack/react-query expo-secure-store expo-local-authentication" 
          language="bash" 
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">2. Setup Provider & Auth Strategy</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Wrap your root component with <code className="text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded">ToronetProvider</code>. You also need to define an Authentication Strategy. For React Native, we highly recommend using the Biometric Strategy which utilizes Face ID or Fingerprint for sensitive operations automatically.
        </p>
        <CodeBlock 
          code={`import React from 'react';
import { ToronetProvider } from '@reactforge/react-native';
import { createBiometricStrategy } from '@reactforge/react-native/core';

// Require Face ID / Fingerprint for sensitive mutations
const authStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'swap', 'wallet-delete', 'kyc'],
  skipFor: ['balance', 'exchange-rates', 'tns-read'],
});

export default function App() {
  return (
    <ToronetProvider
      config={{ network: 'testnet' }}
      authStrategy={authStrategy}
    >
      <MainScreen />
    </ToronetProvider>
  );
}`} 
          language="tsx" 
        />
      </section>
      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Security Architecture</h2>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Hardware Storage:</b> All passwords are saved using <code className="text-white">expo-secure-store</code> mapping directly to the iOS Keychain and Android Keystore.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Biometric Gating:</b> Sensitive mutations hook into <code className="text-white">expo-local-authentication</code> to verify identity before signing.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Auto-Invalidation:</b> Under the hood, <code className="text-white">@tanstack/react-query</code> automatically invalidates and refetches balances after successful transfers.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
