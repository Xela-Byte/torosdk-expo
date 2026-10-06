"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToronetProvider = ToronetProvider;
exports.useToronetContext = useToronetContext;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const auth_1 = require("../core/auth");
const config_1 = require("../core/config");
const storage_1 = require("../core/storage");
const ToronetContext = (0, react_1.createContext)(null);
const DEFAULT_QUERY_CLIENT = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 30000,
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
function ToronetProvider({ config, authStrategy, queryClient, children, }) {
    const [activeAddress, setActiveAddressState] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let mounted = true;
        (0, storage_1.getActiveWallet)().then((addr) => {
            if (mounted && addr) {
                setActiveAddressState(addr);
            }
        }).catch(() => { });
        return () => {
            mounted = false;
        };
    }, []);
    const setActiveAddress = (0, react_1.useCallback)(async (address) => {
        setActiveAddressState(address);
        if (address) {
            await (0, storage_1.setActiveWallet)(address);
        }
    }, []);
    const value = (0, react_1.useMemo)(() => ({
        config,
        authStrategy,
        activeAddress,
        setActiveAddress,
    }), [config, authStrategy, activeAddress, setActiveAddress]);
    (0, react_1.useEffect)(() => {
        (0, config_1.createConfig)(config);
        (0, auth_1.setAuthStrategy)(authStrategy);
    }, [config, authStrategy]);
    const client = queryClient ?? DEFAULT_QUERY_CLIENT;
    return ((0, jsx_runtime_1.jsx)(ToronetContext.Provider, { value: value, children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: client, children: children }) }));
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
function useToronetContext() {
    const ctx = (0, react_1.useContext)(ToronetContext);
    if (!ctx) {
        throw new Error('[torosdk-expo] useToronetContext must be used within a <ToronetProvider>');
    }
    return ctx;
}
//# sourceMappingURL=provider.js.map