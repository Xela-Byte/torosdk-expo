import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function CurrencyAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Currency Admin"
        description="Admin tools for minting, burning, and freezing fiat-backed currencies."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroCurrencyAdmin</code> hook allows authorized administrators to manage fiat-backed currency (NGN, USD, EUR, GBP, KSH, ZAR) supplies, freeze non-compliant accounts, and pause transfers.
        </p>
        <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-500 text-sm">
          <strong>Note:</strong> These functions require the executing wallet to hold specific admin roles on the Toronet network. Regular users calling these functions will receive unauthorized errors.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Minting & Burning</h2>

        <CodeBlock
          language="tsx"
          code={`import { useToroCurrencyAdmin } from '@reactforge/react';

export function CurrencyManager() {
  const { mintCurrencyFunds, burnCurrencyFunds, loading } = useToroCurrencyAdmin();

  const handleMint = async () => {
    await mintCurrencyFunds({
      currency: 'USD',
      admin: 'ADMIN_ADDRESS',
      adminpwd: 'ADMIN_PASSWORD',
      targetAddress: 'RECEIVER_ADDRESS',
      amount: '1000'
    });
  };

  return <button onClick={handleMint}>Mint $1,000</button>;
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Freezing Accounts</h2>
        <p className="text-gray-400">
          Admins can freeze specific accounts from transacting in specific fiat currencies.
        </p>

        <CodeBlock
          language="tsx"
          code={`const { freezeCurrencyAddress, unfreezeCurrencyAddress } = useToroCurrencyAdmin();

await freezeCurrencyAddress({
  currency: 'NGN',
  admin: 'ADMIN_ADDRESS',
  adminpwd: 'ADMIN_PASSWORD',
  address: 'TARGET_ACCOUNT_TO_FREEZE'
});`}
        />
      </section>
    </div>
  );
}
