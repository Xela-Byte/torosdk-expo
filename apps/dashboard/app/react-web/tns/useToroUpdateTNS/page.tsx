'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroUpdateTNSPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroUpdateTNS"
        description="Mutate (update or delete) the Toronet Name Service mapping for a wallet."
      />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroUpdateTNS, useToroDeleteTNS } from '@reactforge/react';" language="tsx" />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <p className="text-gray-400">This hook returns mutation functions. Parameters are passed directly to those functions (newUsername, password).</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  updateTNS: (newUsername: string, password: string) => Promise<boolean>,
  success: boolean,
  loading: boolean,
  error: Error | null
}`} language="typescript" />
      </section>
    </div>
  );
}
