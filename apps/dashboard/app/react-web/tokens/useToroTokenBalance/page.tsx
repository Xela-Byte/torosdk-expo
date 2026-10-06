'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroTokenBalancePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroTokenBalance"
        description="Fetches and normalizes Toronet token balances for a given wallet address."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Calls the Toronet token API to retrieve the token balance (ToroG or custom tokens) alongside metadata like symbol and decimals.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroTokenBalance } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse mt-4">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 text-gray-300 font-medium">Name</th>
              <th className="py-2 text-gray-300 font-medium">Type</th>
              <th className="py-2 text-gray-300 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-3 font-mono text-sm text-pink-400">address</td>
              <td className="py-3 font-mono text-sm text-[#16A34A]">string?</td>
              <td className="py-3 text-gray-400 text-sm">Wallet address to check. Defaults to activeAddress.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  balance: string | null,
  metadata: { name: string, symbol: string, decimals: number } | null,
  loading: boolean,
  error: ToroError | null,
  refetch: () => Promise<void>
}`} language="typescript" />
      </section>
    </div>
  );
}
