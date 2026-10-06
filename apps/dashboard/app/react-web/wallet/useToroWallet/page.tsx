'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroWalletPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroWallet"
        description="Manage connected wallet keys, import private keys, and update credentials."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">This hook allows you to fetch the encrypted keystore data for the currently active wallet, import existing wallets via private key, update passwords, and delete local wallet data.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroWallet } from '@reactforge/react';" language="tsx" />
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
              <td className="py-3 text-gray-400 text-sm">Optional Toronet address. Defaults to the active address in ToroProvider.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  data: { key: any, address: string } | null,
  loading: boolean,
  error: ToroError | null,
  refetch: () => Promise<void>
}`} language="typescript" />
      </section>
    </div>
  );
}
