import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ToronetConfig } from '../core/types';
import type { AuthStrategy } from '../core/auth';
import { setAuthStrategy } from '../core/auth';
import { createConfig } from '../core/config';

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

export function useToronetContext(): ToronetContextValue {
  const ctx = useContext(ToronetContext);
  if (!ctx) {
    throw new Error(
      '[torosdk-expo] useToronetContext must be used within a <ToronetProvider>'
    );
  }
  return ctx;
}
