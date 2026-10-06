'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const CORE_ITEMS = [
  {
    title: 'Quickstart & Core',
    links: [
      { name: 'Introduction', href: '/react-web' },
      { name: '🧪 Live Demo', href: '/react-web/demo' },
      { name: 'Installation', href: '/react-web/installation' },
      { name: 'Architecture & Security', href: '/react-web/architecture' },
    ]
  },
  {
    title: 'Wallet Basics',
    links: [
      { name: 'useToroWallet', href: '/react-web/wallet/useToroWallet' },
      { name: 'useToroCreateWallet', href: '/react-web/wallet/useToroCreateWallet' },
      { name: 'Password & Security', href: '/react-web/wallet/security' },
    ]
  },
  {
    title: 'Balances & Transfers',
    links: [
      { name: 'useToroBalance', href: '/react-web/balances/useToroBalance' },
      { name: 'useToroSend', href: '/react-web/transactions/useToroSend' },
      { name: 'useToroTransactions', href: '/react-web/transactions/useToroTransactions' },
      { name: 'useToroSwap', href: '/react-web/swap' },
    ]
  },
];

const ADVANCED_ITEMS = [
  {
    title: 'Advanced Wallet',
    links: [
      { name: 'Import Wallet', href: '/react-web/wallet/import-wallet' },
      { name: 'Keystore Management', href: '/react-web/wallet/keystore' },
      { name: 'Virtual Wallets', href: '/react-web/wallet/virtual-wallet' },
    ]
  },
  {
    title: 'Tokens & Contracts',
    links: [
      { name: 'Token Balances', href: '/react-web/tokens/useToroTokenBalance' },
      { name: 'Token Metadata', href: '/react-web/tokens/useToroTokenMetadata' },
      { name: 'Deploy Contract', href: '/react-web/contracts/useToroDeployContract' },
      { name: 'Products & POS', href: '/react-web/contracts/products' },
    ]
  },
  {
    title: 'Network & TNS',
    links: [
      { name: 'Blockchain Metrics', href: '/react-web/blockchain/useToroBlockchain' },
      { name: 'Exchange Rates', href: '/react-web/blockchain/useToroExchangeRates' },
      { name: 'TNS Resolution', href: '/react-web/tns/useToroTNSResolve' },
      { name: 'TNS Registration', href: '/react-web/tns/useToroUpdateTNS' },
    ]
  },
  {
    title: 'Interoperability',
    links: [
      { name: 'Toro Bridge', href: '/react-web/bridge/useToroBridge' },
      { name: 'Solana Integration', href: '/react-web/solana' },
    ]
  },
  {
    title: 'Admin & System',
    links: [
      { name: 'Admin Roles', href: '/react-web/roles' },
      { name: 'Currency Admin', href: '/react-web/balances/currency-admin' },
      { name: 'Storage Network', href: '/react-web/storage/useToroStorage' },
      { name: 'KYC & Identity', href: '/react-web/payments/useToroKYCStatus' },
    ]
  }
];

const EXTRA_ITEMS = [
  {
    title: 'Tools & Examples',
    links: [
      { name: 'Transaction Debugger', href: '/tools/tx-debugger' },
      { name: 'Address Inspector', href: '/tools/address-inspector' },
      { name: 'Example Portfolio', href: '/examples/balance-dashboard' },
      { name: 'Example Transactions', href: '/examples/transactions' },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    onClose?.();
  }, [pathname]);

  // Prevent scroll when drawer open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const renderSection = (items: any[]) => (
    items.map((section) => (
      <div key={section.title} className="mb-6">
        <h2 className="text-[10px] font-semibold text-[#52525b] uppercase tracking-widest mb-2 px-2">
          {section.title}
        </h2>
        <ul className="space-y-0.5">
          {section.links.map((link: any) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-2 py-1.5 rounded text-xs transition-colors duration-100 ${
                    isActive
                      ? 'text-white bg-[#1a1a1a] font-medium'
                      : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#111111]'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    ))
  );

  const sidebarContent = (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 md:hidden">
        <span className="text-xs font-medium text-[#16A34A]">Navigation</span>
        <button
          onClick={onClose}
          className="text-[#a1a1aa] hover:text-white p-1 rounded"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-5">
        <nav>
          <div className="mb-2 px-2 pb-2 border-b border-[#1f1f1f]">
            <span className="text-xs font-medium text-[#16A34A]">Core SDK</span>
          </div>
          {renderSection(CORE_ITEMS)}
          <div className="mb-2 px-2 pb-2 mt-4 border-b border-[#1f1f1f]">
            <span className="text-xs font-medium text-[#16A34A]">Advanced APIs</span>
          </div>
          {renderSection(ADVANCED_ITEMS)}
          <div className="mb-2 px-2 pb-2 mt-4 border-b border-[#1f1f1f]">
            <span className="text-xs font-medium text-[#16A34A]">Resources</span>
          </div>
          {renderSection(EXTRA_ITEMS)}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-60 flex-shrink-0 pt-10 border-r border-[#1f1f1f] bg-black h-full hidden md:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-black border-r border-[#1f1f1f] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-14 h-full pb-14">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
