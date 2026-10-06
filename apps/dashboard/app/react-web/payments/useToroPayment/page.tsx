'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroPaymentPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroPayment"
        description="Initiate and confirm fiat and crypto payments via the Toronet admin proxy."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Provides mutations for initializing fiat deposits (NGN, USD, EUR, GBP, KSH, ZAR), confirming deposits via transaction ID, and fetching supported bank lists.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroPayment } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <p className="text-gray-400 mb-4">This hook does not require initialization parameters. Parameters are passed directly to the mutation functions.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  deposit: (input: DepositInput) => Promise<any>,
  confirmDeposit: (currency: string, txid: string) => Promise<boolean>,
  getUSDBanks: (admin: string, adminpwd: string) => Promise<any[]>,
  getNGNBanks: (admin: string, adminpwd: string) => Promise<any[]>,
  loading: boolean,
  error: Error | null
}`} language="typescript" />
      </section>
    </div>
  );
}
