import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function ImportWalletPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Import Wallet"
        description="Import existing wallets using mnemonics or private keys."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroImportWallet</code> hook (exported alongside <code className="bg-gray-800 px-1.5 py-0.5 rounded">useToroWallet</code>) allows users to recover or import an existing wallet onto their current device.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Implementation</h2>
        <p className="text-gray-400">
          When importing a wallet, you must provide the 12-word seed phrase (mnemonic) and set a new password to encrypt the wallet locally on the device.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useToroImportWallet } from '@reactforge/react';
import { useState } from 'react';

export function ImportWalletForm() {
  const { importWallet, loading, error } = useToroImportWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');

  const handleImport = async () => {
    try {
      const address = await importWallet(mnemonic, password);
      console.log('Successfully imported! Address:', address);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <textarea 
        placeholder="12-word mnemonic phrase" 
        onChange={(e) => setMnemonic(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="New local password" 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleImport} disabled={loading}>
        {loading ? 'Importing...' : 'Import Wallet'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}
