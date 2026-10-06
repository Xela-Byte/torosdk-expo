import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export const metadata = {
  title: 'Currency Swaps — ToroForge',
  description: 'Execute decentralized atomic currency swaps on Toronet with useToroSwapQuote and useToroSwap.',
};

export default function SwapPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Currency Swaps"
        description="Get instant quotes and execute atomic on-chain currency swaps between any Toronet-supported currencies."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          Toronet supports decentralized atomic swaps between all fiat-backed currencies (NGN, USD, EUR, GBP, KSH, ZAR) and TORO.
          Use <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroSwapQuote</code> to fetch an
          algorithmic rate estimate before committing, then <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroSwap</code> to
          execute the swap atomically on-chain.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroSwapQuote</h2>
        <p className="text-gray-400">
          A reactive read hook that returns a live swap quote whenever <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">fromCurrency</code>,{' '}
          <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">toCurrency</code>, or{' '}
          <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">amount</code> change.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Parameter</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">fromCurrency</td>
                <td className="px-4 py-3 text-gray-400">string</td>
                <td className="px-4 py-3 text-gray-400">Source currency (e.g. <code className="bg-gray-800 px-1 rounded">&apos;USD&apos;</code>)</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">toCurrency</td>
                <td className="px-4 py-3 text-gray-400">string</td>
                <td className="px-4 py-3 text-gray-400">Target currency (e.g. <code className="bg-gray-800 px-1 rounded">&apos;NGN&apos;</code>)</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">amount</td>
                <td className="px-4 py-3 text-gray-400">number</td>
                <td className="px-4 py-3 text-gray-400">Amount of source currency to swap</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          language="tsx"
          code={`import { useToroSwapQuote } from '@reactforge/react';

export function SwapQuoteDisplay() {
  const { quote, loading, error } = useToroSwapQuote({
    fromCurrency: 'USD',
    toCurrency: 'NGN',
    amount: 100,
  });

  if (loading) return <p>Fetching quote...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>You get: <strong>{quote?.toAmount} NGN</strong></p>
      <p>Rate: 1 USD = {quote?.rate} NGN</p>
      <p>Fee: {quote?.fee} USD</p>
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroSwap</h2>
        <p className="text-gray-400">
          Executes an atomic on-chain currency swap. The swap is irreversible once submitted — always show the user a
          quote confirmation screen first.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Return</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">executeSwap</td>
                <td className="px-4 py-3 text-gray-400">function</td>
                <td className="px-4 py-3 text-gray-400">Call with swap params to submit the transaction</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">loading</td>
                <td className="px-4 py-3 text-gray-400">boolean</td>
                <td className="px-4 py-3 text-gray-400">True while the swap transaction is in-flight</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">result</td>
                <td className="px-4 py-3 text-gray-400">SwapResult | null</td>
                <td className="px-4 py-3 text-gray-400">Transaction hash and amounts after success</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">error</td>
                <td className="px-4 py-3 text-gray-400">Error | null</td>
                <td className="px-4 py-3 text-gray-400">Error from the network if swap fails</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          language="tsx"
          code={`import { useToroSwap, useToroSwapQuote, useToroContext } from '@reactforge/react';

export function SwapPanel() {
  const { activeAddress } = useToroContext();
  const { quote } = useToroSwapQuote({ fromCurrency: 'USD', toCurrency: 'NGN', amount: 50 });
  const { executeSwap, loading, result, error } = useToroSwap();

  const handleSwap = async () => {
    if (!activeAddress || !quote) return;
    await executeSwap({
      fromAddress: activeAddress,
      fromCurrency: 'USD',
      toCurrency: 'NGN',
      amount: '50',
      password: 'wallet_password',
    });
  };

  return (
    <div>
      {quote && <p>You&apos;ll receive ≈ {quote.toAmount} NGN</p>}
      <button onClick={handleSwap} disabled={loading || !quote}>
        {loading ? 'Swapping...' : 'Confirm Swap'}
      </button>
      {result && <p>✅ Swap hash: {result.transactionHash}</p>}
      {error && <p>❌ {error.message}</p>}
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Supported Currency Pairs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">From</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['USD', 'NGN, EUR, GBP, KSH, ZAR, TORO'],
                ['NGN', 'USD, EUR, GBP, KSH, ZAR, TORO'],
                ['EUR', 'USD, NGN, GBP, KSH, ZAR, TORO'],
                ['TORO', 'USD, NGN, EUR, GBP, KSH, ZAR'],
              ].map(([from, to]) => (
                <tr key={from} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-[#16A34A] font-mono">{from}</td>
                  <td className="px-4 py-3 text-gray-400">{to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
