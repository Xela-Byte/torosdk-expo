'use client';
import { PageHeader } from '../../../components/PageHeader';
import { CodeBlock } from '../../../components/CodeBlock';

export default function UtilitiesPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Utility Functions"
        description="Helper functions for address validation, formatting amounts, and error parsing."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Available Utilities</h2>
        <p className="text-gray-400 mb-4">The <code>@reactforge/sdk-adapter</code> exports a number of pure utility functions to help you format data in your UI.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">formatToroAmount</h2>
        <p className="text-gray-400 mb-2">Strips decimals based on token precision.</p>
        <CodeBlock code="import { formatToroAmount } from '@reactforge/sdk-adapter';\n\nformatToroAmount('1000000000000000000', 18); // '1.0000'" language="typescript" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">formatToroCurrency</h2>
        <p className="text-gray-400 mb-2">Safely formats fiat and crypto balances with their symbol.</p>
        <CodeBlock code="formatToroCurrency(1500.5, 'NGN'); // '1500.50 NGN'" language="typescript" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">validateToroAddress</h2>
        <p className="text-gray-400 mb-2">Checks if a string is a valid 42-character hex Toronet address.</p>
        <CodeBlock code="validateToroAddress('0x1234...'); // true/false" language="typescript" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">parseToroError</h2>
        <p className="text-gray-400 mb-2">Extracts a clean, human-readable message from Axios or SDK errors.</p>
        <CodeBlock code="parseToroError(errorObject); // 'Insufficient funds for transfer'" language="typescript" />
      </section>
    </div>
  );
}
