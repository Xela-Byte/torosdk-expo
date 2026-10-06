'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroBridgeBalancePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroBridgeBalance"
        description="Query balances across connected EVM and Solana chains."
      />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroBridgeBalance } from '@reactforge/react';" language="tsx" />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse mt-4">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Description</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">network</td><td className="py-3 font-mono text-sm text-[#16A34A]">BridgeNetwork</td><td className="py-3 text-gray-400 text-sm">Network enum (Solana, Base, Polygon, Bsc, Arbitrum)</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">address</td><td className="py-3 font-mono text-sm text-[#16A34A]">string?</td><td className="py-3 text-gray-400 text-sm">Optional override for the address to check.</td></tr>
          </tbody>
        </table>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{ balance: any | null, loading: boolean, error: Error | null }`} language="typescript" />
      </section>
    </div>
  );
}
