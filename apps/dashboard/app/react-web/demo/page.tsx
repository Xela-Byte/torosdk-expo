'use client';
import { useState } from 'react';
import {
  useToroContext,
  useToroCreateWallet,
  useToroBalance,
  useToroTNSResolve,
  useToroTNSLookup,
  useToroTransactions,
  useToroTokenBalance,
} from '@reactforge/react';
import { PageHeader } from '@/components/PageHeader';

/* ─────────────────── helpers ─────────────────── */
function SectionTitle({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
      <div className="w-8 h-8 rounded-full bg-[#16A34A]/20 flex items-center justify-center text-[#16A34A] text-sm font-bold shrink-0">
        {num}
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-6">{children}</div>
  );
}

function HookBadge({ name }: { name: string }) {
  return (
    <code className="text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded text-sm">{name}</code>
  );
}

function formatTime(i: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - i * 15);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ─────────────────── Section 1: Wallet ─────────────────── */
function WalletSection() {
  const { activeAddress, setActiveAddress } = useToroContext();
  const { createWallet, loading, error } = useToroCreateWallet();
  const [loginAddr, setLoginAddr] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = await createWallet(username, password);
    if (addr) { setActiveAddress(addr); setUsername(''); setPassword(''); }
  };

  return (
    <section className="space-y-4">
      <SectionTitle num={1} title="Wallet — Create or Connect" />
      <p className="text-gray-400 text-sm">
        <HookBadge name="useToroCreateWallet()" /> generates a real address on Toronet Testnet and sets it as your global active wallet for all sections below.
      </p>
      <Card>
        {activeAddress ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#16A34A] text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              Wallet Connected
            </div>
            <div className="bg-black/50 rounded-lg px-4 py-3 border border-[#16A34A]/20">
              <p className="text-xs text-gray-500 mb-1">Active Address</p>
              <p className="font-mono text-sm text-gray-200 break-all">{activeAddress}</p>
            </div>
            <button onClick={() => setActiveAddress(null)} className="text-xs text-gray-500 hover:text-white transition-colors">Disconnect →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connect existing */}
            <form onSubmit={(e) => { e.preventDefault(); if (loginAddr) { setActiveAddress(loginAddr); setLoginAddr(''); }}} className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Connect Existing Address</h3>
              <input type="text" value={loginAddr} onChange={(e) => setLoginAddr(e.target.value)} placeholder="0x..." className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
              <button type="submit" disabled={!loginAddr} className="w-full py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm rounded-lg transition-colors border border-white/10">Connect Address</button>
            </form>
            {/* Create new */}
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Create New Wallet</h3>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
              <button type="submit" disabled={loading || !username || !password} className="w-full py-2 bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
                {loading ? 'Creating...' : 'Create Wallet →'}
              </button>
              {error && <p className="text-red-400 text-xs">{error.message}</p>}
            </form>
          </div>
        )}
      </Card>
    </section>
  );
}

/* ─────────────────── Section 2: Balances ─────────────────── */
function BalanceSection() {
  const { activeAddress } = useToroContext();
  const [customAddr, setCustomAddr] = useState('');
  const target = customAddr.trim() || activeAddress || undefined;
  const { data, loading, error, refetch } = useToroBalance(target);

  const currencies = [
    { label: 'Nigerian Naira', symbol: 'NGN', value: data?.ngnBalance, color: 'from-green-500/20 to-emerald-900/10' },
    { label: 'US Dollar', symbol: 'USD', value: data?.usdBalance, color: 'from-blue-500/20 to-blue-900/10' },
    { label: 'Toro Gas', symbol: 'ToroG', value: data?.toroGBalance, color: 'from-purple-500/20 to-purple-900/10' },
    { label: 'Kenyan Shilling', symbol: 'KSH', value: data?.kshBalance, color: 'from-orange-500/20 to-orange-900/10' },
  ];

  return (
    <section className="space-y-4">
      <SectionTitle num={2} title="Balances — Portfolio View" />
      <p className="text-gray-400 text-sm">
        <HookBadge name="useToroBalance(address?)" /> auto-uses your connected wallet. Paste any address to inspect it instead.
      </p>
      <Card>
        <div className="flex gap-3 mb-5">
          <input type="text" value={customAddr} onChange={(e) => setCustomAddr(e.target.value)} placeholder={activeAddress ? 'Using active wallet…' : 'Paste any 0x address'} className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
          <button onClick={() => refetch()} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">Refresh</button>
        </div>
        <div className="min-h-[120px] flex items-center justify-center">
          {loading && <p className="text-[#16A34A] animate-pulse text-sm">Fetching from Toronet...</p>}
          {error && <p className="text-red-400 text-sm">Error: {error.message}</p>}
          {!loading && !error && !data && <p className="text-gray-600 text-sm">Enter an address or connect a wallet above.</p>}
          {data && !loading && (
            <div className="w-full grid grid-cols-2 gap-4">
              {currencies.map((c) => (
                <div key={c.symbol} className={`bg-gradient-to-br ${c.color} border border-white/5 rounded-xl p-5 relative overflow-hidden`}>
                  <span className="absolute right-2 top-2 text-white/5 text-4xl font-black">{c.symbol}</span>
                  <p className="text-xs text-gray-400 mb-1">{c.label}</p>
                  <p className="text-2xl font-bold text-white">{c.value || '0.00'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

/* ─────────────────── Section 3: Transactions ─────────────────── */
function TransactionsSection() {
  const { activeAddress } = useToroContext();
  const [addrInput, setAddrInput] = useState(activeAddress || '');
  const [target, setTarget] = useState<string | null>(activeAddress);
  const { data: txs, loading, error, refetch } = useToroTransactions(target, 10);

  return (
    <section className="space-y-4">
      <SectionTitle num={3} title="Transactions — Activity Feed" />
      <p className="text-gray-400 text-sm">
        <HookBadge name="useToroTransactions(address, limit)" /> fetches the latest on-chain activity for any wallet.
      </p>
      <Card>
        <div className="flex gap-3 mb-5">
          <input type="text" value={addrInput} onChange={(e) => setAddrInput(e.target.value)} placeholder="Toronet 0x address…" className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
          <button onClick={() => setTarget(addrInput)} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm text-white transition-colors">Search</button>
          <button onClick={() => refetch()} disabled={!target || loading} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors disabled:opacity-40">
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>

        {!target && <p className="text-gray-600 text-sm text-center py-8">Enter an address to view history.</p>}
        {error && <p className="text-red-400 text-sm">Error: {error.message}</p>}
        {target && !error && (
          <div className="rounded-lg overflow-hidden border border-white/5">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-white/5 text-xs text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Time</div>
              <div className="col-span-7">Tx Hash</div>
              <div className="col-span-3 text-right">Value</div>
            </div>
            <div className="divide-y divide-white/5">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 animate-pulse">
                      <div className="col-span-2 h-3 bg-white/10 rounded"/>
                      <div className="col-span-7 h-3 bg-white/10 rounded"/>
                      <div className="col-span-3 h-3 bg-white/10 rounded"/>
                    </div>
                  ))
                : txs && txs.length > 0
                ? txs.map((tx: any, i: number) => (
                    <div key={tx.hash || i} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/[0.02] transition-colors text-sm">
                      <div className="col-span-2 text-gray-500">{formatTime(i)}</div>
                      <div className="col-span-7 font-mono text-[#16A34A] truncate">{tx.hash || `0xmock…${i}`}</div>
                      <div className="col-span-3 text-right text-white">{tx.value || '—'}</div>
                    </div>
                  ))
                : <p className="text-gray-600 text-sm text-center py-6">No transactions found.</p>
              }
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

/* ─────────────────── Section 4: TNS ─────────────────── */
function TNSSection() {
  const [tab, setTab] = useState<'resolve' | 'lookup'>('resolve');
  const [resolveInput, setResolveInput] = useState('');
  const [resolveTarget, setResolveTarget] = useState<string | undefined>();
  const [lookupInput, setLookupInput] = useState('');
  const [lookupTarget, setLookupTarget] = useState<string | undefined>();

  const { data: resolveData, loading: resolveLoading, error: resolveError } = useToroTNSResolve(resolveTarget);
  const { data: lookupData, loading: lookupLoading, error: lookupError } = useToroTNSLookup(lookupTarget);

  return (
    <section className="space-y-4">
      <SectionTitle num={4} title="TNS — Toronet Name Service" />
      <p className="text-gray-400 text-sm">
        <HookBadge name="useToroTNSResolve(name)" /> converts usernames → addresses. <HookBadge name="useToroTNSLookup(address)" /> does the reverse.
      </p>
      <Card>
        <div className="flex border-b border-white/10 mb-6">
          {(['resolve', 'lookup'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === t ? 'text-[#16A34A] border-b-2 border-[#16A34A]' : 'text-gray-500 hover:text-gray-300'}`}>
              {t === 'resolve' ? 'Name → Address' : 'Address → Name'}
            </button>
          ))}
        </div>

        {tab === 'resolve' ? (
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); setResolveTarget(resolveInput); }} className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                <input value={resolveInput} onChange={(e) => setResolveInput(e.target.value)} placeholder="username" className="w-full bg-black border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
              </div>
              <button type="submit" disabled={resolveLoading || !resolveInput} className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-40 text-white text-sm rounded-lg transition-colors">
                {resolveLoading ? '…' : 'Resolve'}
              </button>
            </form>
            {resolveError && <p className="text-red-400 text-xs">{resolveError.message}</p>}
            {resolveData && !resolveLoading && (
              <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-lg px-4 py-3">
                <p className="text-xs text-[#16A34A] mb-1">Resolved Address</p>
                <p className="font-mono text-sm text-gray-200 break-all">{resolveData}</p>
              </div>
            )}
            {resolveTarget && resolveData === null && !resolveLoading && (
              <p className="text-yellow-400 text-xs">@{resolveTarget} — not found or not registered.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); setLookupTarget(lookupInput); }} className="flex gap-3">
              <input value={lookupInput} onChange={(e) => setLookupInput(e.target.value)} placeholder="0x…" className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
              <button type="submit" disabled={lookupLoading || !lookupInput} className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-40 text-white text-sm rounded-lg transition-colors">
                {lookupLoading ? '…' : 'Lookup'}
              </button>
            </form>
            {lookupError && <p className="text-red-400 text-xs">{lookupError.message}</p>}
            {lookupData && !lookupLoading && (
              <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-[#16A34A] mb-1">Primary TNS Handle</p>
                <p className="text-3xl font-bold text-white">@{lookupData}</p>
              </div>
            )}
            {lookupTarget && lookupData === null && !lookupLoading && (
              <p className="text-gray-500 text-xs text-center">No TNS handle bound to this address.</p>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

/* ─────────────────── Section 5: Token Viewer ─────────────────── */
function TokenSection() {
  const { activeAddress } = useToroContext();
  const [walletInput, setWalletInput] = useState(activeAddress || '');
  const [tokenInput, setTokenInput] = useState('');
  const [walletTarget, setWalletTarget] = useState<string | null>(null);

  const { data, loading, error } = useToroTokenBalance(walletTarget);

  return (
    <section className="space-y-4">
      <SectionTitle num={5} title="Tokens — Contract Inspection" />
      <p className="text-gray-400 text-sm">
        <HookBadge name="useToroTokenBalance(address)" /> reads token metadata (name, symbol, decimals, balance) directly from a smart contract.
      </p>
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); setWalletTarget(walletInput); }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Token Contract (0x…)</label>
            <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="0x…" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Wallet Address (0x…)</label>
            <input value={walletInput} onChange={(e) => setWalletInput(e.target.value)} placeholder="0x…" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#16A34A] transition-colors" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={!walletInput || loading} className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
              {loading ? 'Inspecting Contract…' : 'Inspect Token'}
            </button>
          </div>
        </form>

        <div className="min-h-[100px] flex items-center justify-center">
          {!walletTarget && <p className="text-gray-600 text-sm">Enter addresses above to inspect a token.</p>}
          {loading && <p className="text-[#16A34A] animate-pulse text-sm">Reading Smart Contract…</p>}
          {error && <p className="text-red-400 text-sm">Error: {error.message}</p>}
          {data && !loading && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl p-6 text-center">
                <p className="text-xs text-[#16A34A] mb-2">Balance</p>
                <p className="text-4xl font-black text-white">{data.balance}</p>
                <p className="text-sm text-gray-400 mt-1">{data.symbol}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                <div><p className="text-xs text-gray-500">Token Name</p><p className="text-white font-medium">{data.name}</p></div>
                <div><p className="text-xs text-gray-500">Symbol</p><p className="text-white font-mono">{data.symbol}</p></div>
                <div><p className="text-xs text-gray-500">Decimals</p><p className="text-white font-mono">{data.decimals}</p></div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

/* ─────────────────── Main Page ─────────────────── */
export default function DemoPage() {
  return (
    <div className="animate-in fade-in duration-500 space-y-14 pb-24 max-w-3xl">
      <PageHeader
        title="🧪 Interactive SDK Demo"
        description="All sections below are connected to the live Toronet Testnet. Create a wallet, then test every hook — no code needed."
      />
      <WalletSection />
      <BalanceSection />
      <TransactionsSection />
      <TNSSection />
      <TokenSection />
    </div>
  );
}
