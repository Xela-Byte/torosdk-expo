'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';

export default function RNuseCurrencyAdminPage() {
  const codeSnippet = `import { useCurrencyAdmin } from '@reactforge/react-native';

// const admin = useCurrencyAdmin();
// admin.mint.mutate({ currency: 'USD', amount: '1000' });`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="useCurrencyAdmin" 
        description="Administer native currencies: freeze, unfreeze, mint, burn, and enroll assets directly from an authorized mobile device." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A]">useCurrencyAdmin</code> hook integrates seamlessly with the <code className="text-white">@reactforge/react-native</code> mobile ecosystem. Like other core mutations and queries, it adheres to your globally configured authentication strategy and utilizes the Hermes network adapter for optimal React Native performance.
        </p>

        <TryItLab 
          title="Mobile Integration"
          description="Example usage in a React Native component."
          codeSnippet={codeSnippet}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">Platform Considerations</h2>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Secure Execution:</b> If this hook involves signing a transaction, the user will automatically be prompted with Face ID or Fingerprint before the key is decrypted from <code className="text-white">expo-secure-store</code>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Auto-Invalidation:</b> All React Native queries subscribe to the TanStack Query cache. Background polling or subsequent mutations will seamlessly invalidate and refetch data to keep your mobile UI completely in sync.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
