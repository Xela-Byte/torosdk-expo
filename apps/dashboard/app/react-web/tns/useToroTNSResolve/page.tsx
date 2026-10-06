'use client';
import { useState } from 'react';
import { TryItLab } from '../../../../components/TryItLab';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';
import { useToroTNSResolve } from '@reactforge/react';

function TNSResolveLab() {
  const [name, setName] = useState('');
  const [target, setTarget] = useState<string | undefined>(undefined);
  const { data, loading, error } = useToroTNSResolve(target);

  const codeSnippet = `import { useToroTNSResolve } from '@reactforge/react';

function SendByUsername({ name }) {
  const { data: address, loading, error } = useToroTNSResolve(name);

  return (
    <div>
      {loading && <p>Resolving...</p>}
      {address && <p>Resolved: {address}</p>}
      {error && <p>Name not found</p>}
    </div>
  );
}`;

  return (
    <TryItLab title="useToroTNSResolve" description="Resolve a TNS name to a real Toronet address." codeSnippet={codeSnippet}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="username" className="w-full bg-black border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#16A34A] focus:ring-0 focus:ring-blue-400/30 transition-all text-sm" />
          </div>
          <button onClick={() => setTarget(name)} disabled={!name} className="bg-[#16A34A] hover:opacity-90 disabled:opacity-50 px-8 py-2.5 rounded-lg text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(96,165,250,0.2)] hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">Resolve</button>
        </div>
        <div className="bg-black/50 rounded-xl p-6 border border-white/5 min-h-[100px] flex flex-col items-center justify-center">
          {loading && <div className="text-indigo-400 animate-pulse text-sm">Resolving TNS name...</div>}
          {error && <div className="text-red-400 text-sm">Error: {error.message}</div>}
          {data && !loading && (
            <div className="text-center">
              <div className="text-indigo-400 text-lg font-semibold mb-1">@{target}</div>
              <div className="text-xs text-gray-400 mb-2">resolves to</div>
              <div className="font-mono text-white text-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10">{data}</div>
            </div>
          )}
          {data === null && !loading && target && <div className="text-yellow-400 text-sm">No address found for @{target}</div>}
          {!target && !loading && <div className="text-gray-500 text-sm">Enter a TNS username to resolve.</div>}
        </div>
      </div>
    </TryItLab>
  );
}

export default function UseToroTNSResolvePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroTNSResolve"
        description="Resolves a Toronet Name Service (TNS) username to its corresponding wallet address."
      />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400">Works like ENS on Ethereum — resolves a human-readable username like <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">@alice</code> to its full Toronet wallet address.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">When to use it</h2>
        <p className="text-gray-400">Use in payment forms to let users type a username instead of a wallet address. Combine with <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">useToroSend</code> — resolve the name first, then use the address to send.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroTNSResolve } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Parameters</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-white/10"><th className="py-2 text-gray-300 font-medium">Name</th><th className="py-2 text-gray-300 font-medium">Type</th><th className="py-2 text-gray-300 font-medium">Description</th></tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="py-3 font-mono text-sm text-pink-400">name</td><td className="py-3 font-mono text-sm text-[#16A34A]">string?</td><td className="py-3 text-gray-400 text-sm">TNS username to resolve (without @)</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Return value</h2>
        <CodeBlock code="{ data: string | null, loading: boolean, error: Error | null, refetch: () => void }" language="typescript" />
      </section>

      <TNSResolveLab />
    </div>
  );
}
