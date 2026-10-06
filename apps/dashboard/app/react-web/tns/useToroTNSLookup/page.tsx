import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroTNSLookupPage() {
  const exampleCode = `import { useToroTNSLookup } from '@reactforge/react';

function AddressDisplay({ address }) {
  const { data: name } = useToroTNSLookup(address);

  // Shows "@alice" if found, or falls back to the raw address
  return (
    <span>{name ? \`@\${name}\` : address}</span>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroTNSLookup"
        description="Reverse-resolve a wallet address to its TNS username."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">The reverse of <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">useToroTNSResolve</code>. Takes a wallet address and returns the associated TNS username if one exists — useful for displaying friendly names instead of raw hex addresses.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use when displaying recipient or sender information in a transaction list. Instead of showing <code className="text-gray-300 bg-white/5 px-1.5 py-0.5 rounded text-sm">0xabc...123</code>, you can show <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">@alice</code>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroTNSLookup } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Basic Example</h2>
        <CodeBlock code={exampleCode} language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Description</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">address</td><td className="py-3 font-mono text-sm text-[#16A34A]">string?</td><td className="py-3 text-gray-400 text-sm">The wallet address to reverse-lookup</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code="{ data: string | null, loading: boolean, error: Error | null, refetch: () => void }" language="typescript" />
        <p className="text-gray-500 text-sm mt-2">Returns <code className="text-gray-400">null</code> if the address has no TNS name registered.</p>
      </section>
    </div>
  );
}
