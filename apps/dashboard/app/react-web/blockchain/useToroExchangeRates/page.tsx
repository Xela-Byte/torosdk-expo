'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroExchangeRatesPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroExchangeRates"
        description="Get current Toronet exchange rates for supported fiat/crypto assets."
      />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroExchangeRates } from '@reactforge/react';" language="tsx" />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <p className="text-gray-400">No parameters required.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{ data: ExchangeRate[], loading: boolean, error: Error | null }`} language="typescript" />
      </section>
    </div>
  );
}
