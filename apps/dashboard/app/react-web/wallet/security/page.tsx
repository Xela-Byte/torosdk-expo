import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export const metadata = {
  title: 'Wallet Password & Security — ToroForge',
  description: 'Verify, update, and delete wallet credentials with useToroVerifyPassword, useToroUpdatePassword, and useToroDeleteWallet.',
};

export default function WalletSecurityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Wallet Security"
        description="Hooks for verifying passwords, rotating credentials, and removing wallets from the network."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroVerifyPassword</h2>
        <p className="text-gray-400">
          Verify that a password matches the stored credential for a wallet address — without signing or sending any transaction.
          Useful for pre-flight checks before sensitive operations.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Return</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">verify</td>
                <td className="px-4 py-3 text-gray-400">(address, password) =&gt; Promise&lt;boolean | null&gt;</td>
                <td className="px-4 py-3 text-gray-400">Call to run the verification</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">isValid</td>
                <td className="px-4 py-3 text-gray-400">boolean | null</td>
                <td className="px-4 py-3 text-gray-400">Result after verify() resolves</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">loading</td>
                <td className="px-4 py-3 text-gray-400">boolean</td>
                <td className="px-4 py-3 text-gray-400">True while network call is in-flight</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-[#16A34A] font-mono">error</td>
                <td className="px-4 py-3 text-gray-400">Error | null</td>
                <td className="px-4 py-3 text-gray-400">Network or validation error</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { useToroVerifyPassword } from '@reactforge/react';

export function PasswordGate({ address, onSuccess }: { address: string; onSuccess: () => void }) {
  const { verify, isValid, loading, error } = useToroVerifyPassword();

  const handleCheck = async (pwd: string) => {
    const ok = await verify(address, pwd);
    if (ok) onSuccess();
  };

  return (
    <div>
      {loading && <p>Verifying...</p>}
      {isValid === false && <p className="text-red-400">Incorrect password</p>}
      {error && <p className="text-red-400">{error.message}</p>}
      <button onClick={() => handleCheck('entered_password')}>Verify</button>
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroUpdatePassword</h2>
        <p className="text-gray-400">
          Rotate the active wallet&apos;s password. Uses the <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">activeAddress</code> from context —
          no address parameter needed.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useToroUpdatePassword } from '@reactforge/react';

export function ChangePasswordForm() {
  const { updatePassword, success, loading, error } = useToroUpdatePassword();

  const handleChange = async () => {
    const ok = await updatePassword('current_password', 'new_secure_password');
    if (ok) console.log('Password rotated successfully');
  };

  return (
    <div>
      <button onClick={handleChange} disabled={loading}>
        {loading ? 'Updating...' : 'Change Password'}
      </button>
      {success && <p className="text-green-400">✅ Password updated</p>}
      {error && <p className="text-red-400">❌ {error.message}</p>}
    </div>
  );
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroDeleteWallet</h2>
        <p className="text-gray-400">
          Permanently removes the active wallet account from the Toronet network. This action is <strong>irreversible</strong>. The password is required as
          final confirmation before deletion.
        </p>
        <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
          <strong>⚠️ Warning:</strong> Deleting a wallet is permanent. Any funds held in the account will be inaccessible. Always confirm with the user before calling this hook.
        </div>
        <CodeBlock
          language="tsx"
          code={`import { useToroDeleteWallet } from '@reactforge/react';

export function DeleteWalletButton() {
  const { deleteWalletAccount, loading, success, error } = useToroDeleteWallet();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure? This is permanent.');
    if (!confirmed) return;
    await deleteWalletAccount('wallet_password');
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Deleting...' : 'Delete Wallet'}
      </button>
      {success && <p className="text-green-400">Wallet removed</p>}
      {error && <p className="text-red-400">{error.message}</p>}
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}
