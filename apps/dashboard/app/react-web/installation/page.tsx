'use client';
import { PageHeader } from '../../../components/PageHeader';
import { CodeBlock } from '../../../components/CodeBlock';

export default function InstallationPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Installation & Setup"
        description="Get started with ToroForge by installing the required packages and setting up the provider."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">1. Install Packages</h2>
        <p className="text-gray-400 mb-4">Install the React hooks library and the underlying SDK adapter.</p>
        <CodeBlock code="npm install @reactforge/react @reactforge/sdk-adapter" language="bash" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">2. Setup Provider</h2>
        <p className="text-gray-400 mb-4">Wrap your application with the <code>ToroProvider</code> to initialize the SDK and make wallet state accessible globally.</p>
        <CodeBlock code={`import { ToroProvider } from '@reactforge/react';

function App({ children }) {
  return (
    <ToroProvider config={{ network: 'testnet' }}>
      {children}
    </ToroProvider>
  );
}

export default App;`} language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Provider Configuration</h2>
        <table className="w-full text-left border-collapse mt-4">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 text-gray-300 font-medium">Property</th>
              <th className="py-2 text-gray-300 font-medium">Type</th>
              <th className="py-2 text-gray-300 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-3 font-mono text-sm text-pink-400">network</td>
              <td className="py-3 font-mono text-sm text-[#16A34A]">'mainnet' | 'testnet'</td>
              <td className="py-3 text-gray-400 text-sm">The Toronet network to connect to.</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 font-mono text-sm text-pink-400">baseURL</td>
              <td className="py-3 font-mono text-sm text-[#16A34A]">string?</td>
              <td className="py-3 text-gray-400 text-sm">Optional override for the RPC endpoint.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
