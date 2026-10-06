import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export const metadata = {
  title: 'Solana Bridge — ToroForge',
  description: 'Full Toronet–Solana integration: create Solana addresses, transfer SOL and SPL tokens, and query Solana balances.',
};

export default function SolanaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Solana Suite"
        description="Full Toronet–Solana integration via useToroSolana: create addresses, transfer SOL/SPL tokens, and query balances and history."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          Toronet maintains a native bridge to the Solana network. The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroSolana</code> hook
          (and its named exports) lets you create Solana-linked accounts, transfer SOL and SPL tokens, and inspect Solana balances — all authenticated by your
          Toronet wallet credentials.
        </p>
        <div className="p-4 bg-[#16A34A]/10 border border-[#16A34A]/50 rounded-lg text-[#16A34A] text-sm">
          All Solana operations are routed through Toronet&apos;s infrastructure — you do <strong>not</strong> need to manage a separate Solana keypair or wallet.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Hook Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Hook</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['useToroCreateSolanaAddress', 'mutation', 'Generate a new standalone Solana keypair address'],
                ['useToroCreateToronetSolanaAddress', 'mutation', 'Link a Toronet account to a Solana address'],
                ['useToroTransferSolana', 'mutation', 'Send native SOL from a Toronet-linked address'],
                ['useToroTransferSolToken', 'mutation', 'Send SPL tokens on Solana'],
                ['useToroSolBalance', 'query', 'Query the SOL balance of a Toronet-linked Solana address'],
                ['useToroSolTokenBalance', 'query', 'Query SPL token balance for a given mint'],
                ['useToroSolTransactions', 'query', 'View Solana transaction history for an address'],
                ['useToroSolTokenTransactions', 'query', 'Token-specific Solana transaction history'],
                ['useToroIsValidSolanaAddress', 'query', 'Validate if a string is a valid Solana public key'],
              ].map(([hook, type, desc]) => (
                <tr key={hook} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-[#16A34A] font-mono text-xs">{hook}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      type === 'mutation' ? 'bg-orange-900/40 text-orange-400' : 'bg-green-900/40 text-green-400'
                    }`}>{type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Linking a Toronet Wallet to Solana</h2>
        <CodeBlock
          language="tsx"
          code={`import { useToroCreateToronetSolanaAddress } from '@reactforge/react';
import { useToroContext } from '@reactforge/react';

export function LinkSolanaAccount() {
  const { activeAddress } = useToroContext();
  const { createAddress, loading, result, error } = useToroCreateToronetSolanaAddress();

  const handleLink = async () => {
    if (!activeAddress) return;
    const res = await createAddress({
      toroAddress: activeAddress,
      password: 'wallet_password',
    });
    console.log('Solana address:', res?.solanaAddress);
  };

  return (
    <div>
      <button onClick={handleLink} disabled={loading}>
        {loading ? 'Linking...' : 'Link Solana Account'}
      </button>
      {result && <p>✅ Linked: {result.solanaAddress}</p>}
      {error && <p>❌ {error.message}</p>}
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Query SOL Balance</h2>
        <CodeBlock
          language="tsx"
          code={`import { useToroSolBalance } from '@reactforge/react';

export function SolBalanceCard({ toroAddress }: { toroAddress: string }) {
  const { balance, loading, error, refetch } = useToroSolBalance(toroAddress);

  if (loading) return <p>Loading SOL balance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>SOL Balance: <strong>{balance} SOL</strong></p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Transfer SOL</h2>
        <CodeBlock
          language="tsx"
          code={`import { useToroTransferSolana, useToroContext } from '@reactforge/react';

export function TransferSolPanel() {
  const { activeAddress } = useToroContext();
  const { transfer, loading, result, error } = useToroTransferSolana();

  const handleTransfer = async () => {
    if (!activeAddress) return;
    await transfer({
      fromToroAddress: activeAddress,
      toSolanaAddress: 'DESTINATION_SOLANA_ADDRESS',
      amount: '0.5',
      password: 'wallet_password',
    });
  };

  return (
    <div>
      <button onClick={handleTransfer} disabled={loading}>
        {loading ? 'Sending...' : 'Send 0.5 SOL'}
      </button>
      {result && <p>✅ Tx: {result.signature}</p>}
      {error && <p>❌ {error.message}</p>}
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">SPL Token Transfers</h2>
        <CodeBlock
          language="tsx"
          code={`import { useToroTransferSolToken, useToroSolTokenBalance } from '@reactforge/react';

export function SplTokenPanel({ toroAddress, mint }: { toroAddress: string; mint: string }) {
  const { balance } = useToroSolTokenBalance(toroAddress, mint);
  const { transfer, loading } = useToroTransferSolToken();

  return (
    <div>
      <p>Token balance: {balance}</p>
      <button
        disabled={loading}
        onClick={() => transfer({
          fromToroAddress: toroAddress,
          toSolanaAddress: 'DESTINATION',
          mint,
          amount: '10',
          password: 'wallet_password',
        })}
      >
        {loading ? 'Sending...' : 'Send 10 tokens'}
      </button>
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Validate a Solana Address</h2>
        <CodeBlock
          language="tsx"
          code={`import { useToroIsValidSolanaAddress } from '@reactforge/react';

// Simple client-side pubkey format check
const { isValid } = useToroIsValidSolanaAddress('SOME_SOLANA_ADDRESS');
console.log('Valid Solana pubkey?', isValid);`}
        />
      </section>
    </div>
  );
}
