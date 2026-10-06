// src/ToroBalance.tsx
import { useToroBalance } from "@reactforge/react";
import { formatToroCurrency } from "@reactforge/sdk-adapter";
import { jsx, jsxs } from "react/jsx-runtime";
var ToroBalance = ({ address, className = "", showAll = false }) => {
  const { data, loading, error } = useToroBalance(address);
  if (loading) return /* @__PURE__ */ jsx("div", { className: `animate-pulse bg-gray-200 h-10 w-48 rounded ${className}` });
  if (error) return /* @__PURE__ */ jsx("div", { className: `text-red-500 text-sm ${className}`, children: "Error loading balance" });
  if (!data) return /* @__PURE__ */ jsx("div", { className: `text-gray-500 text-sm ${className}`, children: "No balance data" });
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-white ${className}`, children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2", children: "Balances" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "ToroG" }),
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatToroCurrency(data.toroGBalance, "TORO") })
    ] }),
    (showAll || parseFloat(data.ngnBalance) > 0) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "NGN" }),
      /* @__PURE__ */ jsx("span", { children: formatToroCurrency(data.ngnBalance, "NGN") })
    ] }),
    (showAll || parseFloat(data.usdBalance) > 0) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "USD" }),
      /* @__PURE__ */ jsx("span", { children: formatToroCurrency(data.usdBalance, "USD") })
    ] }),
    (showAll || parseFloat(data.kshBalance) > 0) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "KSH" }),
      /* @__PURE__ */ jsx("span", { children: formatToroCurrency(data.kshBalance, "KSH") })
    ] })
  ] });
};

// src/ToroTokenBalance.tsx
import { useToroTokenBalance } from "@reactforge/react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ToroTokenBalance = ({ address, className = "" }) => {
  const { data, loading, error } = useToroTokenBalance(address);
  if (loading) return /* @__PURE__ */ jsx2("div", { className: `animate-pulse bg-gray-200 h-10 w-48 rounded ${className}` });
  if (error) return /* @__PURE__ */ jsx2("div", { className: `text-red-500 text-sm ${className}`, children: "Error loading token balance" });
  if (!data) return null;
  return /* @__PURE__ */ jsx2("div", { className: `flex items-center gap-2 p-3 border rounded-lg bg-gray-50 ${className}`, children: /* @__PURE__ */ jsxs2("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxs2("span", { className: "text-xl font-bold text-gray-900", children: [
      data.balance,
      " ",
      /* @__PURE__ */ jsx2("span", { className: "text-sm font-normal text-gray-500", children: data.symbol || "TOROG" })
    ] }),
    data.name && /* @__PURE__ */ jsx2("span", { className: "text-xs text-gray-400", children: data.name })
  ] }) });
};

// src/ToroTransactionList.tsx
import { useToroTransactions } from "@reactforge/react";
import { formatToroTransaction, shortenAddress } from "@reactforge/sdk-adapter";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var ToroTransactionList = ({ address, count = 10, className = "" }) => {
  const { data, loading, error } = useToroTransactions(address, count);
  if (loading) return /* @__PURE__ */ jsx3("div", { className: `p-4 text-gray-500 ${className}`, children: "Loading transactions..." });
  if (error) return /* @__PURE__ */ jsx3("div", { className: `p-4 text-red-500 ${className}`, children: "Error loading transactions" });
  if (!data || data.length === 0) return /* @__PURE__ */ jsx3("div", { className: `p-4 text-gray-500 ${className}`, children: "No transactions found." });
  return /* @__PURE__ */ jsx3("div", { className: `overflow-x-auto ${className}`, children: /* @__PURE__ */ jsxs3("table", { className: "w-full text-sm text-left", children: [
    /* @__PURE__ */ jsx3("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50", children: /* @__PURE__ */ jsxs3("tr", { children: [
      /* @__PURE__ */ jsx3("th", { className: "px-4 py-3", children: "Hash" }),
      /* @__PURE__ */ jsx3("th", { className: "px-4 py-3", children: "Amount" }),
      /* @__PURE__ */ jsx3("th", { className: "px-4 py-3", children: "From" }),
      /* @__PURE__ */ jsx3("th", { className: "px-4 py-3", children: "To" }),
      /* @__PURE__ */ jsx3("th", { className: "px-4 py-3", children: "Status" })
    ] }) }),
    /* @__PURE__ */ jsx3("tbody", { children: data.map((rawTx, i) => {
      const tx = formatToroTransaction(rawTx);
      return /* @__PURE__ */ jsxs3("tr", { className: "border-b hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx3("td", { className: "px-4 py-3 font-mono text-blue-600", children: shortenAddress(tx.hash) }),
        /* @__PURE__ */ jsxs3("td", { className: "px-4 py-3 font-medium", children: [
          tx.amount,
          " ",
          tx.currency
        ] }),
        /* @__PURE__ */ jsx3("td", { className: "px-4 py-3 font-mono", children: shortenAddress(tx.from) }),
        /* @__PURE__ */ jsx3("td", { className: "px-4 py-3 font-mono", children: shortenAddress(tx.to) }),
        /* @__PURE__ */ jsx3("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx3("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${tx.status === "success" ? "bg-green-100 text-green-800" : tx.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, children: tx.status }) })
      ] }, tx.hash || i);
    }) })
  ] }) });
};

// src/ToroTransactionStatus.tsx
import { useToroTransactionStatus } from "@reactforge/react";
import { jsx as jsx4 } from "react/jsx-runtime";
var ToroTransactionStatus = ({ hash, className = "" }) => {
  const { status, loading, error } = useToroTransactionStatus(hash);
  if (loading) return /* @__PURE__ */ jsx4("span", { className: `text-gray-500 animate-pulse ${className}`, children: "Checking status..." });
  if (error) return /* @__PURE__ */ jsx4("span", { className: `text-red-500 ${className}`, children: "Status unknown" });
  let colorClass = "bg-gray-100 text-gray-800";
  if (status === "success") colorClass = "bg-green-100 text-green-800";
  if (status === "failed") colorClass = "bg-red-100 text-red-800";
  if (status === "pending") colorClass = "bg-yellow-100 text-yellow-800";
  return /* @__PURE__ */ jsx4("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`, children: status });
};

// src/ToroWallet.tsx
import { useToroContext } from "@reactforge/react";
import { shortenAddress as shortenAddress2 } from "@reactforge/sdk-adapter";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var ToroWallet = ({ className = "" }) => {
  const { activeAddress, setActiveAddress } = useToroContext();
  if (!activeAddress) {
    return /* @__PURE__ */ jsxs4("div", { className: `p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 ${className}`, children: [
      "No active wallet connected. Use ",
      /* @__PURE__ */ jsx5("code", { children: "useToroContext().connectWallet()" }),
      " to set one up."
    ] });
  }
  return /* @__PURE__ */ jsxs4("div", { className: `flex items-center justify-between p-3 border rounded-lg bg-gray-50 ${className}`, children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx5("div", { className: "h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs", children: "W" }),
      /* @__PURE__ */ jsxs4("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-xs text-gray-500", children: "Connected Wallet" }),
        /* @__PURE__ */ jsx5("span", { className: "text-sm font-mono font-medium text-gray-900", children: shortenAddress2(activeAddress, 8, 6) })
      ] })
    ] }),
    /* @__PURE__ */ jsx5(
      "button",
      {
        onClick: () => setActiveAddress(null),
        className: "text-xs text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors",
        children: "Disconnect"
      }
    )
  ] });
};

// src/ToroTNS.tsx
import React, { useState } from "react";
import { useToroTNSLookup, useToroTNSResolve } from "@reactforge/react";
import { Fragment, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var ToroTNS = ({ className = "", defaultMode = "resolve" }) => {
  const [mode, setMode] = useState(defaultMode);
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), 500);
    return () => clearTimeout(timer);
  }, [input]);
  const { data: addressData, loading: resolveLoading, error: resolveError } = useToroTNSResolve(
    mode === "resolve" ? debouncedInput : void 0
  );
  const { data: nameData, loading: lookupLoading, error: lookupError } = useToroTNSLookup(
    mode === "lookup" ? debouncedInput : void 0
  );
  return /* @__PURE__ */ jsxs5("div", { className: `p-4 border rounded-lg bg-white shadow-sm max-w-md ${className}`, children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg", children: [
      /* @__PURE__ */ jsx6(
        "button",
        {
          className: `flex-1 text-sm py-1.5 rounded-md transition-colors ${mode === "resolve" ? "bg-white shadow-sm font-medium text-gray-900" : "text-gray-500 hover:text-gray-700"}`,
          onClick: () => {
            setMode("resolve");
            setInput("");
            setDebouncedInput("");
          },
          children: "Name to Address"
        }
      ),
      /* @__PURE__ */ jsx6(
        "button",
        {
          className: `flex-1 text-sm py-1.5 rounded-md transition-colors ${mode === "lookup" ? "bg-white shadow-sm font-medium text-gray-900" : "text-gray-500 hover:text-gray-700"}`,
          onClick: () => {
            setMode("lookup");
            setInput("");
            setDebouncedInput("");
          },
          children: "Address to Name"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx6("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: mode === "resolve" ? "TNS Name (e.g. alice)" : "Toronet Address" }),
      /* @__PURE__ */ jsx6(
        "input",
        {
          type: "text",
          className: "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          placeholder: mode === "resolve" ? "Enter username..." : "0x...",
          value: input,
          onChange: (e) => setInput(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "min-h-[3rem] p-3 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center", children: [
      mode === "resolve" && /* @__PURE__ */ jsxs5(Fragment, { children: [
        resolveLoading && /* @__PURE__ */ jsx6("span", { className: "text-sm text-gray-500 animate-pulse", children: "Resolving..." }),
        resolveError && /* @__PURE__ */ jsx6("span", { className: "text-sm text-red-500", children: "Name not found" }),
        !resolveLoading && !resolveError && addressData && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col w-full", children: [
          /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-500 mb-1", children: "Resolved Address:" }),
          /* @__PURE__ */ jsx6("span", { className: "text-sm font-mono font-medium break-all", children: addressData })
        ] }),
        !resolveLoading && !resolveError && !addressData && debouncedInput && /* @__PURE__ */ jsx6("span", { className: "text-sm text-gray-400", children: "Type a complete name..." })
      ] }),
      mode === "lookup" && /* @__PURE__ */ jsxs5(Fragment, { children: [
        lookupLoading && /* @__PURE__ */ jsx6("span", { className: "text-sm text-gray-500 animate-pulse", children: "Looking up..." }),
        lookupError && /* @__PURE__ */ jsx6("span", { className: "text-sm text-red-500", children: "No name found for address" }),
        !lookupLoading && !lookupError && nameData && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col w-full items-center text-center", children: [
          /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-500 mb-1", children: "TNS Name:" }),
          /* @__PURE__ */ jsx6("span", { className: "text-lg font-bold text-gray-900", children: nameData })
        ] }),
        !lookupLoading && !lookupError && !nameData && debouncedInput && /* @__PURE__ */ jsx6("span", { className: "text-sm text-gray-400", children: "Enter a valid address..." })
      ] })
    ] })
  ] });
};

// src/ToroBridgeStatus.tsx
import { useToroBridgeBalance } from "@reactforge/react";
import { BridgeNetwork, formatToroAmount } from "@reactforge/sdk-adapter";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var ToroBridgeStatus = ({ address, className = "" }) => {
  const { balance: solBalance, loading: solLoading } = useToroBridgeBalance(BridgeNetwork.Solana, address);
  const { balance: baseBalance, loading: baseLoading } = useToroBridgeBalance(BridgeNetwork.Base, address);
  const { balance: polyBalance, loading: polyLoading } = useToroBridgeBalance(BridgeNetwork.Polygon, address);
  const { balance: bscBalance, loading: bscLoading } = useToroBridgeBalance(BridgeNetwork.BSC, address);
  const { balance: arbBalance, loading: arbLoading } = useToroBridgeBalance(BridgeNetwork.Arbitrum, address);
  const chains = [
    { name: "Solana", loading: solLoading, balance: solBalance },
    { name: "Base", loading: baseLoading, balance: baseBalance },
    { name: "Polygon", loading: polyLoading, balance: polyBalance },
    { name: "BSC", loading: bscLoading, balance: bscBalance },
    { name: "Arbitrum", loading: arbLoading, balance: arbBalance }
  ];
  return /* @__PURE__ */ jsxs6("div", { className: `p-4 border rounded-lg bg-white shadow-sm ${className}`, children: [
    /* @__PURE__ */ jsxs6("h3", { className: "text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx7("span", { children: "\u{1F309}" }),
      " Bridge Balances"
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "grid gap-2", children: chains.map((chain) => /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100", children: [
      /* @__PURE__ */ jsx7("span", { className: "text-sm text-gray-600 font-medium", children: chain.name }),
      /* @__PURE__ */ jsx7("div", { className: "text-sm", children: chain.loading ? /* @__PURE__ */ jsx7("span", { className: "text-gray-400 animate-pulse", children: "Loading..." }) : chain.balance ? /* @__PURE__ */ jsxs6("span", { className: "font-mono text-gray-900", children: [
        formatToroAmount(chain.balance),
        " TORO"
      ] }) : /* @__PURE__ */ jsx7("span", { className: "text-gray-400", children: "---" }) })
    ] }, chain.name)) })
  ] });
};
export {
  ToroBalance,
  ToroBridgeStatus,
  ToroTNS,
  ToroTokenBalance,
  ToroTransactionList,
  ToroTransactionStatus,
  ToroWallet
};
