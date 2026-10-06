import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CopyButton from '@/components/CopyButton';

export const metadata = {
  title: 'ToroForge — React & React Native SDK for Toronet',
  description: 'Type-safe React and React Native hooks for every Toronet feature.',
};

const PACKAGES = [
  {
    tag: 'Web',
    name: '@reactforge/react',
    count: '26 hooks',
    description: 'React hooks for wallet, balance, payments, TNS, Solana, bridge, swaps, KYC, roles, and more.',
    features: ['useState + useEffect pattern', 'localStorage address persistence', 'Full TypeScript generics', 'Tree-shakeable ESM'],
    href: '/react-web/installation',
    cta: 'React Web Docs',
  },
  {
    tag: 'Mobile',
    name: '@reactforge/react-native',
    count: '21 hooks',
    description: 'TanStack Query hooks for Expo and React Native with hardware biometric auth and SecureStore.',
    features: ['TanStack Query v5', 'Face ID / Fingerprint gating', 'expo-secure-store credentials', 'Automatic cache invalidation'],
    href: '/react-native/installation',
    cta: 'React Native Docs',
  },
  {
    tag: 'Core',
    name: '@reactforge/sdk-adapter',
    count: '19 modules',
    description: 'Pure TypeScript Toronet API adapter. Framework-agnostic — works in Node.js, browser, or React Native.',
    features: ['Zero React dependency', 'Full type coverage', 'Network error wrapping', 'Testnet & mainnet support'],
    href: '/react-web/installation',
    cta: 'View SDK Docs',
  },
];

const FEATURES = [
  'Wallet Management', 'Balances & Currencies', 'Payments & Transfers',
  'Toro Name Service', 'Cross-Chain Bridge', 'Solana Integration',
  'Currency Swaps', 'KYC & Compliance', 'Transaction History',
  'Blockchain Metrics', 'Roles & Permissions', 'Token Metadata',
  'Products Catalog', 'Virtual Wallets', 'Chain Storage', 'Contract Deployer',
];

const STATS = [
  { value: '47+', label: 'Typed Hooks' },
  { value: '100%', label: 'API Coverage' },
  { value: '3', label: 'Packages' },
  { value: '0', label: 'Boilerplate' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-36 pb-24 px-6 border-b border-[#1f1f1f] text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs text-[#16A34A] font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            Toronet Blockchain SDK
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.02] mb-7">
            Build on Toronet.<br /> <span className='text-[#16A34A]'>Ship faster.</span>
          </h1>

          <p className="text-xl text-[#71717a] leading-relaxed mb-12 max-w-xl mx-auto">
            Type-safe React and React Native hooks for every Toronet feature.
            100% API coverage, zero boilerplate.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/react-web/installation"
              id="hero-react-docs"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-black text-sm font-semibold hover:bg-[#f0f0f0] transition-colors duration-150"
            >
              React Web Docs
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/react-native/installation"
              id="hero-rn-docs"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803d] transition-colors duration-150"
            >
              React Native Docs
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="flex flex-wrap gap-10 mt-16 pt-16 border-t border-[#1f1f1f] justify-center">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-xs text-[#52525b] mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="py-20 px-6 border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl capitalize text-center  font-bold text-white mb-2">Three packages, one ecosystem</h2>
            <p className="text-[#71717a] text-md text-center">Pick the package that fits your platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1f1f1f] rounded-xl overflow-hidden border border-[#1f1f1f]">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`bg-black p-7 flex flex-col ${i === 0 ? 'md:rounded-l-xl' : ''} ${i === 2 ? 'md:rounded-r-xl' : ''}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-semibold text-[#16A34A] uppercase tracking-widest border border-[#16A34A]/30 px-2 py-0.5 rounded">
                    {pkg.tag}
                  </span>
                  <span className="text-[11px] text-[#52525b] font-mono">{pkg.count}</span>
                </div>
                <h3 className="font-mono text-sm font-semibold text-white mb-3">{pkg.name}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed mb-6 flex-1">{pkg.description}</p>
                <ul className="space-y-2 mb-7">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#a1a1aa]">
                      <svg className="w-3 h-3 text-[#16A34A] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.href}
                  className="text-xs font-semibold text-[#a1a1aa] hover:text-white transition-colors duration-150 flex items-center gap-1.5"
                >
                  {pkg.cta}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTALLATION ── */}
      <section className="py-20 px-6 border-b border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl text-center font-bold text-white mb-2">Installation</h2>
            <p className="text-[#71717a] text-md text-center">Get up and running in under a minute.</p>
          </div>
          <div className="space-y-3">

            {/* React Web */}
            <div className="rounded-lg border border-[#1f1f1f] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1f1f1f] bg-[#080808]">
                <span className="text-xs text-[#52525b] font-mono">React Web</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#16A34A] font-semibold">npm</span>
                  <CopyButton text="npm install @reactforge/react @reactforge/sdk-adapter" />
                </div>
              </div>
              <pre className="px-5 py-4 text-sm font-mono overflow-x-auto bg-[#050505]">
                <code>
                  <span className="text-[#16A34A]">npm</span>
                  <span className="text-[#71717a]"> install </span>
                  <span className="text-[#e5e5e5]">@reactforge/react</span>
                  {' '}
                  <span className="text-[#a1a1aa]">@reactforge/sdk-adapter</span>
                </code>
              </pre>
            </div>

            {/* React Native */}
            <div className="rounded-lg border border-[#1f1f1f] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1f1f1f] bg-[#080808]">
                <span className="text-xs text-[#52525b] font-mono">React Native / Expo</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#16A34A] font-semibold">npm</span>
                  <CopyButton text="npm install @reactforge/react-native @reactforge/sdk-adapter @tanstack/react-query expo-secure-store expo-local-authentication" />
                </div>
              </div>
              <pre className="px-5 py-4 text-sm font-mono overflow-x-auto bg-[#050505]">
                <code>
                  <span className="text-[#16A34A]">npm</span>
                  <span className="text-[#71717a]"> install </span>
                  <span className="text-[#e5e5e5]">@reactforge/react-native @reactforge/sdk-adapter</span>
                  {' \\\n  '}
                  <span className="text-[#a1a1aa]">@tanstack/react-query expo-secure-store expo-local-authentication</span>
                </code>
              </pre>
            </div>

            {/* Quick start */}
            <div className="rounded-lg border border-[#1f1f1f] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1f1f1f] bg-[#080808]">
                <span className="text-xs text-[#52525b] font-mono">App.tsx — React Web quick start</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#71717a]">tsx</span>
                  <CopyButton text={`// Wrap once — all hooks available everywhere\nimport { ToroProvider, useToroBalance, useToroContext } from '@reactforge/react'\n\nfunction App() {\n  return (\n    <ToroProvider network="testnet">\n      <YourApp />\n    </ToroProvider>\n  );\n}`} />
                </div>
              </div>
              <pre className="px-5 py-4 text-sm font-mono overflow-x-auto bg-[#050505] leading-relaxed">
                <span className="text-[#7c7c7c]">{'// Wrap once — all hooks available everywhere'}</span>{'\n'}
                <span className="text-[#a78bfa]">import</span>{' '}
                <span className="text-[#e5e5e5]">{'{ ToroProvider, useToroBalance, useToroContext }'}</span>{' '}
                <span className="text-[#a78bfa]">from</span>{' '}
                <span className="text-[#86efac]">&apos;@reactforge/react&apos;</span>
                {'\n\n'}
                <span className="text-[#60a5fa]">function</span>{' '}
                <span className="text-[#fde68a]">App</span>
                <span className="text-[#e5e5e5]">{'() {'}</span>{'\n'}
                <span className="text-[#e5e5e5]">{'  return ('}</span>{'\n    '}
                <span className="text-[#6ee7b7]">{'<ToroProvider'}</span>{' '}
                <span className="text-[#fde68a]">network</span>
                <span className="text-[#e5e5e5]">=</span>
                <span className="text-[#86efac]">&quot;testnet&quot;</span>
                <span className="text-[#6ee7b7]">&gt;</span>{'\n      '}
                <span className="text-[#7c7c7c]">{'<YourApp />'}</span>{'\n    '}
                <span className="text-[#6ee7b7]">{'</ToroProvider>'}</span>{'\n'}
                <span className="text-[#e5e5e5]">{'  );\n}'}</span>
              </pre>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 px-6 border-b border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl text-center font-bold text-white mb-2">Full API coverage</h2>
            <p className="text-[#71717a] text-center text-md">Every Toronet feature wrapped in a clean, typed hook.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1f1f1f] rounded-xl overflow-hidden border border-[#1f1f1f]">
            {FEATURES.map((f, i) => (
              <div
                key={f}
                className={`bg-black px-4 py-3.5 text-sm text-[#a1a1aa] font-medium hover:text-white hover:bg-[#0d0d0d] transition-colors cursor-default
                  ${i === 0 ? 'rounded-tl-xl' : ''}
                  ${i === 3 ? 'rounded-tr-xl' : ''}
                  ${i === 12 ? 'rounded-bl-xl' : ''}
                  ${i === 15 ? 'rounded-br-xl' : ''}
                `}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-6 border-b border-[#1f1f1f]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-3">Ready to build?</h2>
          <p className="text-[#71717a] text-md text-center mb-8">Start with React Web or jump into React Native.</p>
          <div className="flex w-[80%] mx-auto flex-wrap  justify-center gap-3">
            <Link
              href="/react-web/installation"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-white text-black text-sm font-semibold hover:bg-[#f0f0f0] transition-colors duration-150"
            >
              React Web Docs
            </Link>
            <Link
              href="/react-native/installation"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#2a2a2a] text-[#a1a1aa] text-sm font-medium hover:text-white hover:border-[#3a3a3a] transition-all duration-150"
            >
              React Native Docs
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-7 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row w-[80%] mx-auto items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 ">
            <div className="w-5 h-5 bg-[#16A34A] rounded flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <polygon points="8,1 14,4.5 14,11.5 8,15 2,11.5 2,4.5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#52525b]">ToroForge</span>
            <span className="text-[#2a2a2a] text-xs">·</span>
            <span className="text-sm text-[#3f3f46]">MIT License</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#52525b]">
            <Link href="/react-web/installation" className="hover:text-[#a1a1aa] transition-colors">React Web Docs</Link>
            <Link href="/react-native/installation" className="hover:text-[#a1a1aa] transition-colors">React Native Docs</Link>
            <a href="https://github.com/toroforge/reactforge" target="_blank" rel="noopener noreferrer" className="hover:text-[#a1a1aa] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
