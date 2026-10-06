'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const GITHUB_URL = 'https://github.com/toroforge/reactforge';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-black/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">

        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button — only shown on docs/rn pages where sidebar exists */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#16A34A] rounded flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <polygon points="8,1 14,4.5 14,11.5 8,15 2,11.5 2,4.5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">ToroForge</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/react-web/installation" active={pathname.startsWith('/react-web')}>
            React Web Docs
          </NavLink>
          <NavLink href="/react-native/installation" active={pathname.startsWith('/react-native')}>
            React Native Docs
          </NavLink>
          <div className="w-px h-4 bg-[#2a2a2a] mx-2" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2a2a2a] text-xs font-medium text-[#a1a1aa] hover:text-white hover:border-[#3a3a3a] transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Contribute
          </a>
        </nav>

        {/* Mobile: compact doc links */}
        <nav className="flex md:hidden items-center gap-1">
          <Link
            href="/react-web/installation"
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${pathname.startsWith('/react-web') ? 'text-white bg-[#1a1a1a]' : 'text-[#a1a1aa]'
              }`}
          >
            Web
          </Link>
          <Link
            href="/react-native/installation"
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${pathname.startsWith('/react-native') ? 'text-white bg-[#1a1a1a]' : 'text-[#a1a1aa]'
              }`}
          >
            Native
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${active ? 'text-white bg-[#1a1a1a]' : 'text-[#a1a1aa] hover:text-white'
        }`}
    >
      {children}
    </Link>
  );
}
