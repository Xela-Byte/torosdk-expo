import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ToronetConfig } from '../core/types';
import type { AuthStrategy } from '../core/auth';
import { setAuthStrategy } from '../core/auth';
import { createConfig } from '../core/config';
import { getActiveWallet, setActiveWallet as setActiveWalletStorage } from '../core/storage';

/**
 * Props for the {@link ToronetProvider} root component.
 *
 * @property config - Network selection and optional API base URL override.
 * @property authStrategy - The auth strategy to use for all SDK operations.
 * @property queryClient - Optional `@tanstack/react-query` QueryClient (a default with retry=2 and staleTime=30s is provided if omitted).
 * @property children - Your app's React tree.
 */
export interface ToronetProviderProps {
  config: ToronetConfig;
  authStrategy: AuthStrategy;
  queryClient?: QueryClient;
  children: ReactNode;
}

export interface ToronetContextValue {
  config: ToronetConfig;
  authStrategy: AuthStrategy;
  activeAddress: string | null;
  setActiveAddress: (address: string | null) => Promise<void>;
}

const ToronetContext = createContext<ToronetContextValue | null>(null);

const DEFAULT_QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});

/**
 * Root provider component for torosdk-expo.
 *
 * @remarks
 * Wrap your app's component tree with `ToronetProvider` to enable all hooks.
 * It initializes the SDK config, registers the auth strategy, and wraps
 * children in a `@tanstack/react-query` `QueryClientProvider`.
 *
 * @example
 * ```tsx
 * import { ToronetProvider } from 'torosdk-expo';
 * import { createPasswordStrategy } from 'torosdk-expo/core';
 *
 * export default function App() {
 *   return (
 *     <ToronetProvider
 *       config={{ network: 'testnet' }}
 *       authStrategy={createPasswordStrategy()}
 *     >
 *       <MainScreen />
 *     </ToronetProvider>
 *   );
 * }
 * ```
 */
export function ToronetProvider({
  config,
  authStrategy,
  queryClient,
  children,
}: ToronetProviderProps): React.JSX.Element {
  const [activeAddress, setActiveAddressState] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getActiveWallet().then((addr) => {
      if (mounted && addr) {
        setActiveAddressState(addr);
      }
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const setActiveAddress = useCallback(async (address: string | null) => {
    setActiveAddressState(address);
    if (address) {
      await setActiveWalletStorage(address);
    }
  }, []);

  const value = useMemo<ToronetContextValue>(
    () => ({
      config,
      authStrategy,
      activeAddress,
      setActiveAddress,
    }),
    [config, authStrategy, activeAddress, setActiveAddress]
  );

  useEffect(() => {
    createConfig(config);
    setAuthStrategy(authStrategy);
  }, [config, authStrategy]);

  const client = queryClient ?? DEFAULT_QUERY_CLIENT;

  return (
    <ToronetContext.Provider value={value}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </ToronetContext.Provider>
  );
}


/**
 * Access the current Toronet config and auth strategy from any descendant component.
 *
 * @remarks
 * Most apps won't need this directly — prefer the higher-level hooks
 * (useBalance, useTransfer, etc.) which access the context internally.
 *
 * @throws If called outside a {@link ToronetProvider}.
 * @returns The context value containing `config` and `authStrategy`.
 */
export function useToronetContext(): ToronetContextValue {
  const ctx = useContext(ToronetContext);
  if (!ctx) {
    throw new Error(
      '[torosdk-expo] useToronetContext must be used within a <ToronetProvider>'
    );
  }
  return ctx;
}
