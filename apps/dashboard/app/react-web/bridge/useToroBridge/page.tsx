'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroBridgePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroBridge"
        description="Transfer assets seamlessly across Toronet, Solana, Base, Polygon, BSC, and Arbitrum."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Provides mutations to execute cross-chain token transfers and estimate bridge fees before transferring.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroBridge } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <p className="text-gray-400 mb-4">This hook exposes mutation functions. Pass <code>BridgeTransferParams</code> to the transfer function.</p>
        <CodeBlock code={`interface BridgeTransferParams {
  from: string;
  pwd: string;
  network: BridgeNetwork; // e.g. BridgeNetwork.Base
  contractaddress: string;
  tokenname: string;
  amount: string;
}`} language="typescript" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  transfer: (params: BridgeTransferParams, admin?: string, adminpwd?: string) => Promise<any>,
  getFeeEstimate: (params: BridgeFeeParams, admin?: string, adminpwd?: string) => Promise<any>,
  loading: boolean,
  error: Error | null
}`} language="typescript" />
      </section>
    </div>
  );
}
