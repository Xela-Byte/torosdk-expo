'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroDeployContractPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroDeployContract"
        description="Deploy a smart contract directly to the Toronet blockchain."
      />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroDeployContract } from '@reactforge/react';" language="tsx" />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <p className="text-gray-400">Pass a <code>DeployContractInput</code> to the <code>deploy</code> function containing the bytecode, abi, owner, and constructor args.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  deploy: (input: DeployContractInput) => Promise<DeployContractOutput | null>,
  data: DeployContractOutput | null,
  loading: boolean,
  error: Error | null
}`} language="typescript" />
      </section>
    </div>
  );
}
