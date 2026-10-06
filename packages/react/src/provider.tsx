import React, { createContext, useContext, useEffect, useState } from 'react';
import { initToroforge, NetworkType } from '@reactforge/sdk-adapter';

interface ToroContextValue {
  network: NetworkType;
  activeAddress: string | null;
  setActiveAddress: (address: string | null) => void;
}

const ToroContext = createContext<ToroContextValue | undefined>(undefined);

export interface ToroProviderProps {
  children: React.ReactNode;
  network?: NetworkType;
  baseURL?: string;
}

export const ToroProvider: React.FC<ToroProviderProps> = ({ children, network = 'mainnet', baseURL }) => {
  const [activeAddress, setActiveAddressState] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem('toroforge_active_address');
      } catch {
        return null;
      }
    }
    return null;
  });

  const setActiveAddress = (address: string | null) => {
    setActiveAddressState(address);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (address) {
          window.localStorage.setItem('toroforge_active_address', address);
        } else {
          window.localStorage.removeItem('toroforge_active_address');
        }
      } catch {}
    }
  };

  useEffect(() => {
    initToroforge({ network, baseURL });
  }, [network, baseURL]);

  return (
    <ToroContext.Provider value={{ network, activeAddress, setActiveAddress }}>
      {children}
    </ToroContext.Provider>
  );
};

export const useToroContext = () => {
  const context = useContext(ToroContext);
  if (!context) {
    throw new Error('useToroContext must be used within a ToroProvider');
  }
  return context;
};
