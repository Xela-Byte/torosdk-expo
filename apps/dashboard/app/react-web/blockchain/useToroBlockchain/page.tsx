'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroBlockchainPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroBlockchain"
        description="Query blockchain status, blocks, and network health."
      />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroBlockchain } from '@reactforge/react';" language="tsx" />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse mt-4">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Description</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">blockCount</td><td className="py-3 font-mono text-sm text-[#16A34A]">number</td><td className="py-3 text-gray-400 text-sm">Number of recent blocks to fetch (default: 10)</td></tr>
          </tbody>
        </table>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  data: { status: BlockchainStatus | null, latestBlock: Block | null, blocks: Block[] },
  loading: boolean,
  error: Error | null
}`} language="typescript" />
      </section>
    </div>
  );
}
