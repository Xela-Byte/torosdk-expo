'use client';
import { ToroProvider } from '@reactforge/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToroProvider network="testnet">{children}</ToroProvider>;
}
