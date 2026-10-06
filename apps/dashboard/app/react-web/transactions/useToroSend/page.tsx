'use client';
import { useState } from 'react';
import { TryItLab } from '../../../../components/TryItLab';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';
import { useToroSend, useToroContext } from '@reactforge/react';

function SendLab() {
  const { setActiveAddress } = useToroContext();
  const { sendTransaction, loading, error } = useToroSend();
  const [form, setForm] = useState({ senderAddr: '', receiverAddr: '', amount: '', currency: 'NGN', senderPwd: '' });
  const [result, setResult] = useState<any>(null);

  const handleSend = async () => {
    if (!form.senderAddr) return;
    setActiveAddress(form.senderAddr);
    try {
      const res = await sendTransaction({ receiverAddr: form.receiverAddr, amount: form.amount, currency: form.currency, senderPwd: form.senderPwd });
      setResult(res);
    } catch {}
  };

  const codeSnippet = `import { useToroSend } from '@reactforge/react';

function SendForm() {
  const { sendTransaction, loading, error } = useToroSend();

  const handleSubmit = async () => {
    const result = await sendTransaction({
      receiverAddr: '0xRecipient...',
      amount: '10',
      currency: 'NGN',
      senderPwd: userPassword,
    });
    console.log(result);
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Sending...' : 'Send'}
    </button>
  );
}`;

  return (
    <TryItLab title="useToroSend" description="Execute a real testnet transfer." codeSnippet={codeSnippet}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={form.senderAddr} onChange={e => setForm(f => ({...f, senderAddr: e.target.value}))} placeholder="Your Wallet Address" className="bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-0 focus:ring-blue-400/30 transition-all" />
        <input value={form.senderPwd} onChange={e => setForm(f => ({...f, senderPwd: e.target.value}))} type="password" placeholder="Wallet Password" className="bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-0 focus:ring-blue-400/30 transition-all" />
        <input value={form.receiverAddr} onChange={e => setForm(f => ({...f, receiverAddr: e.target.value}))} placeholder="Recipient Address" className="bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-0 focus:ring-blue-400/30 transition-all" />
        <div className="flex gap-3">
          <input value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="Amount" className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-0 transition-all" />
          <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))} className="bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-0 focus:ring-blue-400/30 transition-all">
            <option>NGN</option><option>USD</option><option>ToroG</option>
          </select>
        </div>
        <button onClick={handleSend} disabled={loading} className="md:col-span-2 bg-[#16A34A] hover:opacity-90 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">
          {loading ? 'Sending Transaction...' : 'Send Transaction'}
        </button>
      </div>
      <div className="mt-4 bg-black/50 rounded-xl p-4 border border-white/5 min-h-[60px]">
        {result && <pre className="text-[#16A34A] text-xs font-mono">{JSON.stringify(result, null, 2)}</pre>}
        {error && <div className="text-red-400 text-sm">Error: {error.message}</div>}
        {!result && !error && !loading && <div className="text-gray-500 text-sm text-center">Fill in the form above to test a transfer.</div>}
      </div>
    </TryItLab>
  );
}

export default function UseToroSendPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroSend"
        description="A mutation hook for sending currency transfers from the active wallet to a recipient."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Executes a currency transfer on the Toronet network. Supports all currencies: NGN, USD, ToroG, and more. Requires the sender's wallet password to authorize the keystore operation.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use in payment forms and P2P transfer interfaces. Always prompt the user for their password at the moment of action — never store it between operations.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroSend } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">sendTransaction parameters</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Description</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">receiverAddr</td><td className="py-3 font-mono text-sm text-[#16A34A]">string</td><td className="py-3 text-gray-400 text-sm">Recipient wallet address</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">amount</td><td className="py-3 font-mono text-sm text-[#16A34A]">string</td><td className="py-3 text-gray-400 text-sm">Amount to send</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">currency</td><td className="py-3 font-mono text-sm text-[#16A34A]">string</td><td className="py-3 text-gray-400 text-sm">"NGN", "USD", "ToroG", etc.</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">senderPwd</td><td className="py-3 font-mono text-sm text-[#16A34A]">string</td><td className="py-3 text-gray-400 text-sm">Sender's wallet password (required)</td></tr>
          </tbody>
        </table>
      </section>

      <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-sm text-red-300">
          <strong>🔒 Security:</strong> The wallet password authorizes the Toronet keystore operation server-side. Never store it beyond the lifecycle of a single action. Prompt users via a modal at the moment of transfer.
        </p>
      </div>

      <SendLab />
    </div>
  );
}
