'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';
import { CodeBlock } from '@/components/CodeBlock';

export default function RNAuthStrategiesPage() {
  const biometricSnippet = `import React from 'react';
import { ToronetProvider } from '@reactforge/react-native';
import { createBiometricStrategy } from '@reactforge/react-native/core';

// 1. Define sensitive mutations that require Face ID / Fingerprint
const authStrategy = createBiometricStrategy({
  requireFor: [
    'transfer',       // Token & currency transfers
    'swap',           // Atomic currency swaps
    'wallet-delete',  // Removing keys from device
    'kyc'             // Identity submissions
  ],
  skipFor: [
    'balance',        // Viewing account balances
    'exchange-rates', // Reading live ticker rates
    'tns-read'        // Resolving Toronet domains
  ],
  promptMessage: 'Authenticate with Face ID to sign this transaction',
  fallbackLabel: 'Use device passcode',
});

// 2. Supply to ToronetProvider at your app root
export default function App() {
  return (
    <ToronetProvider
      config={{ network: 'testnet' }}
      authStrategy={authStrategy}
    >
      <MainAppNavigator />
    </ToronetProvider>
  );
}`;

  const customSnippet = `import { createCustomStrategy } from '@reactforge/react-native/core';
import { showCustomPinModal } from '@/components/PinModal';

// Custom strategy pattern for custom PIN pad or remote approval
const customPinStrategy = createCustomStrategy(async ({ action, address }) => {
  if (action === 'transfer' || action === 'swap') {
    // Present custom in-app 6-digit PIN modal
    const pin = await showCustomPinModal({
      title: 'Enter Transaction PIN',
      wallet: address,
    });
    return { authorized: true, passwordOverride: pin };
  }
  return { authorized: true };
});`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Biometric & Auth Strategies" 
        description="Configure Face ID, Touch ID, and hardware storage authentication policies for mobile actions." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Mobile blockchain applications operate under distinct security constraints compared to web apps. Instead of requiring users to re-enter complex 24-character passwords every time they send funds, the <code className="text-[#16A34A]">@reactforge/react-native</code> SDK leverages the <strong>Strategy Pattern</strong> coupled with hardware-backed keystores.
        </p>

        <TryItLab 
          title="Configuring Biometric Strategy"
          description="Enforce Face ID or Touch ID before signing sensitive operations like transfers and swaps."
          codeSnippet={biometricSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Available Strategies</h2>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium text-sm font-mono text-[#16A34A]">
                createBiometricStrategy(options)
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#16A34A]/10 text-[#16A34A] font-medium">Recommended</span>
            </div>
            <p className="text-xs text-[#71717a] leading-relaxed mb-3">
              Uses <code className="text-white">expo-local-authentication</code> to verify identity via iOS Face ID, Touch ID, or Android BiometricPrompt before reading the hardware-encrypted password from <code className="text-white">expo-secure-store</code>.
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <span className="text-[11px] text-[#52525b] uppercase font-semibold tracking-wider">Config Options:</span>
              <ul className="mt-2 space-y-1 text-xs text-[#a1a1aa]">
                <li><code className="text-white">requireFor</code>: Array of action names that require biometric gating.</li>
                <li><code className="text-white">skipFor</code>: Array of action names executed silently without biometric prompts.</li>
                <li><code className="text-white">promptMessage</code>: Custom message displayed in the OS biometric modal.</li>
                <li><code className="text-white">fallbackLabel</code>: Text for the fallback button (e.g., 'Enter Passcode').</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <h3 className="text-white font-medium text-sm font-mono text-[#16A34A] mb-2">
              createPasswordStrategy()
            </h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Silently resolves credentials from <code className="text-white">expo-secure-store</code> without presenting a biometric dialog. Ideal for development or background non-interactive synchronization.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <h3 className="text-white font-medium text-sm font-mono text-[#16A34A] mb-2">
              createCustomStrategy(handler)
            </h3>
            <p className="text-xs text-[#71717a] leading-relaxed mb-3">
              Provides full control over authorization flow. Allows triggering custom PIN screens, 2FA prompts, or remote enterprise approvals.
            </p>
            <CodeBlock code={customSnippet} language="tsx" />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">How Credentials Are Stored</h2>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">1.</span>
            <span>When <code className="text-white">useCreateWallet</code> or <code className="text-white">useImportWallet</code> succeeds, the encrypted private key and signing passphrases are stored in <code className="text-white">expo-secure-store</code>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">2.</span>
            <span>On iOS, keys are protected in the <b>Keychain Services</b> with accessibility set to <code className="text-white">kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly</code>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">3.</span>
            <span>On Android, keys are AES-GCM encrypted using an asymmetric master key located inside the <b>Android Keystore</b>.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
