'use client';
import { useState } from 'react';
import { TryItLab } from '../../../../components/TryItLab';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';
import { useToroCreateWallet } from '@reactforge/react';

function CreateWalletLab() {
  const { createWallet, address, loading, error } = useToroCreateWallet();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCreate = async () => {
    if (!username || !password) return;
    setSubmitted(true);
    await createWallet(username, password);
  };

  const codeSnippet = `import { useToroCreateWallet } from '@reactforge/react';

function CreateWalletForm() {
  const { createWallet, address, loading, error } = useToroCreateWallet();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createWallet(username, password);
    }}>
      <input name="username" placeholder="Choose a username" />
      <input name="password" type="password" />
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create Wallet'}
      </button>
      {address && <p>Wallet created: {address}</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}`;

  return (
    <TryItLab title="useToroCreateWallet" description="Create a real testnet wallet and see the returned address." codeSnippet={codeSnippet}>
      <div className="space-y-4 flex flex-col py-4">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username (TNS handle)" className="w-full md:w-[70%] mx-auto bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all text-sm" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Set wallet password" className="w-full md:w-[70%] mx-auto bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all text-sm" />
        <button onClick={handleCreate} disabled={loading || !username || !password} className="w-full md:w-[50%] mx-auto bg-[#16A34A] hover:opacity-90 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-all text-sm shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">
          {loading ? 'Creating Wallet...' : 'Create Wallet on Testnet'}
        </button>
        <div className="mt-4 bg-black/50 rounded-xl p-4 border border-white/5 min-h-[80px] flex items-center justify-center">
          {!submitted && <span className="text-gray-500 text-sm">Result will appear here.</span>}
          {loading && <span className="text-indigo-400 animate-pulse text-sm">Creating wallet on Toronet testnet...</span>}
          {address && <div className="text-center"><div className="text-xs text-gray-400 mb-1">New Wallet Address</div><div className="font-mono text-indigo-400 text-sm break-all">{address}</div></div>}
          {error && <div className="text-red-400 text-sm"><strong>Error:</strong> {error.message}</div>}
        </div>
      </div>
    </TryItLab>
  );
}

export default function UseToroCreateWalletPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroCreateWallet"
        description="Creates a new Toronet wallet with an associated TNS username and returns the wallet address."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Generates a Toronet keystore, registers a TNS username, and returns the new wallet address. Automatically checks TNS availability before attempting creation.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use in any onboarding flow where new users register. Pair with a secure password input — the password is required for all future write operations on that wallet.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroCreateWallet } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code={`{
  createWallet: (username: string, password: string) => Promise<string | null>,
  address: string | null,   // populated after successful creation
  loading: boolean,
  error: Error | null
}`} language="typescript" />
      </section>

      <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-sm text-yellow-300">
          <strong>⚠ Security:</strong> Never store the password in component state long-term or in localStorage. Prompt the user each time a write operation is needed.
        </p>
      </div>

      <CreateWalletLab />
    </div>
  );
}
