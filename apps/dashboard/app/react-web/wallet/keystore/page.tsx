import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function KeystorePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Keystore Management"
        description="Securely manage, import, and delete wallet keystores on Toronet."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroKeystore</code> hook provides direct access to the Toronet wallet storage mechanism. It allows users to import external private keys, update their encryption passwords, and delete local wallet data securely.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Importing a Wallet</h2>
        <p className="text-gray-400">
          You can import a wallet from an existing private key and secure it with a new password. The hook returns the wallet address upon successful import.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useToroKeystore } from '@reactforge/react';
import { useState } from 'react';

export function ImportWallet() {
  const { importWalletFromPrivateKey, loading, error } = useToroKeystore();
  const [pvKey, setPvKey] = useState('');
  const [password, setPassword] = useState('');

  const handleImport = async () => {
    try {
      const address = await importWalletFromPrivateKey(pvKey, password);
      console.log('Successfully imported wallet:', address);
    } catch (err) {
      console.error('Import failed', err);
    }
  };

  return (
    <div>
      <input type="password" placeholder="Private Key" onChange={e => setPvKey(e.target.value)} />
      <input type="password" placeholder="New Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleImport} disabled={loading}>Import</button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Updating Passwords</h2>
        <p className="text-gray-400">
          Users can rotate the password that encrypts their keystore using the <code className="bg-gray-800 px-1.5 py-0.5 rounded">updateWalletPassword</code> function.
        </p>

        <CodeBlock
          language="tsx"
          code={`const handleUpdatePassword = async () => {
  await updateWalletPassword(address, currentPassword, newPassword);
};`}
        />
      </section>

    </div>
  );
}
