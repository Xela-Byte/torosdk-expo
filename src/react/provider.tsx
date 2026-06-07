import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ToronetConfig } from '../core/types';
import type { AuthStrategy } from '../core/auth';
import { setAuthStrategy } from '../core/auth';
import { createConfig } from '../core/config';

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

interface ToronetContextValue {
  config: ToronetConfig;
  authStrategy: AuthStrategy;
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
}: ToronetProviderProps): JSX.Element {
  const value = useMemo<ToronetContextValue>(
    () => ({ config, authStrategy }),
    [config, authStrategy]
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
