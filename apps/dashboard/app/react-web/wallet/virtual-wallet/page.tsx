import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function VirtualWalletPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Virtual Wallets"
        description="Create and manage frictionless virtual accounts connected to a master wallet."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          Virtual Wallets allow a single master wallet to spawn and manage sub-accounts (virtual wallets) without the user needing to store seed phrases. This is perfect for in-app balances, game economies, and frictionless onboarding.
        </p>
        <p className="text-gray-400">
          The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroVirtualWallet</code> hook wraps all virtual wallet functionality.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Creating a Virtual Wallet</h2>
        <p className="text-gray-400">
          Creating a virtual wallet requires the password of the active wallet (which acts as the master account).
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useToroVirtualWallet } from '@reactforge/react';

export function VirtualWalletManager() {
  const { createVirtualWallet, getVirtualWalletInfo, loading } = useToroVirtualWallet();

  const handleCreate = async () => {
    try {
      const response = await createVirtualWallet("MASTER_WALLET_PASSWORD");
      console.log('Virtual Wallet Address:', response.virtualAddress);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create Virtual Wallet'}
    </button>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Funding & Transactions</h2>
        <p className="text-gray-400">
          You can fund virtual wallets directly from the master wallet, and submit transactions on their behalf.
        </p>

        <CodeBlock
          language="tsx"
          code={`// Fund a virtual wallet from the master wallet
await fundVirtualWallet("MASTER_PASSWORD", "VIRTUAL_ADDRESS", "100.00");

// Submit a transaction on behalf of the virtual wallet
await submitVirtualWalletTx("VIRTUAL_ADDRESS", "MASTER_PASSWORD", {
  to: "RECEIVER_ADDRESS",
  amount: "50.00",
  currency: "TOROG"
});`}
        />
      </section>

    </div>
  );
}
