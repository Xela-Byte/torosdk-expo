'use client';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

export default function DocsIntroductionPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <PageHeader 
        title="React Web SDK" 
        description="Build secure, responsive Toronet decentralized applications for the browser." 
      />

      <section className="mb-12">
        <p className="text-[#a1a1aa] mb-6 text-sm leading-relaxed">
          The <code className="text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded font-mono">@reactforge/react</code> SDK provides a comprehensive suite of React hooks to interact with the Toronet blockchain. Whether you are building a simple portfolio tracker, a decentralized exchange, or an admin portal for smart contracts, the SDK offers strongly typed, easy-to-use methods for every core Toronet feature.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              ⚡
            </div>
            <h3 className="text-white font-medium text-base mb-1">Instant Reactivity</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Every hook automatically subscribes to your active Toronet wallet context. When the user switches accounts, balances and data update instantly.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              🔐
            </div>
            <h3 className="text-white font-medium text-base mb-1">Web-First Security</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Designed around the constraints of the browser, ensuring encrypted keystores stay safe in <code className="text-[#a1a1aa]">localStorage</code> while transaction signing requires active user intent.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              🌐
            </div>
            <h3 className="text-white font-medium text-base mb-1">Decentralized Storage</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Hooks for querying the Toronet Name Service (TNS) and the decentralized key-value storage network are built-in natively.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="w-8 h-8 rounded bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
              🌉
            </div>
            <h3 className="text-white font-medium text-base mb-1">Cross-Chain Ready</h3>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Interact seamlessly with Solana and EVM bridge contracts directly from your web application using the specialized Bridge suite.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-white">Explore the Web Docs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link 
            href="/react-web/installation" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              Installation &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Set up the Toronet context provider in your React application.
            </p>
          </Link>

          <Link 
            href="/react-web/architecture" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              Web Architecture &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Understand how state, keys, and networking are managed in the browser.
            </p>
          </Link>

          <Link 
            href="/react-web/wallet/useToroCreateWallet" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              Creating Wallets &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Learn how to provision new ECDSA keypairs for your users.
            </p>
          </Link>

          <Link 
            href="/react-web/transactions/useToroSend" 
            className="p-4 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#16A34A]/50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-[#16A34A] transition-colors">
              Sending Funds &rarr;
            </h4>
            <p className="text-xs text-[#71717a] mt-1">
              Sign and submit blockchain transactions using volatile passwords.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
