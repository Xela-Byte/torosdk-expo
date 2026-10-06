'use client';
import { useState } from 'react';
import SidebarRN from '@/components/SidebarRN';
import Navbar from '@/components/Navbar';

export default function RNDocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden pt-14">
        <SidebarRN isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-black scroll-smooth">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
