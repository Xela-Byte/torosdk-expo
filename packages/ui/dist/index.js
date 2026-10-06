"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ToroBalance: () => ToroBalance,
  ToroBridgeStatus: () => ToroBridgeStatus,
  ToroTNS: () => ToroTNS,
  ToroTokenBalance: () => ToroTokenBalance,
  ToroTransactionList: () => ToroTransactionList,
  ToroTransactionStatus: () => ToroTransactionStatus,
  ToroWallet: () => ToroWallet
});
module.exports = __toCommonJS(index_exports);

// src/ToroBalance.tsx
var import_react = require("@reactforge/react");
var import_sdk_adapter = require("@reactforge/sdk-adapter");
var import_jsx_runtime = require("react/jsx-runtime");
var ToroBalance = ({ address, className = "", showAll = false }) => {
  const { data, loading, error } = (0, import_react.useToroBalance)(address);
  if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `animate-pulse bg-gray-200 h-10 w-48 rounded ${className}` });
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `text-red-500 text-sm ${className}`, children: "Error loading balance" });
  if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `text-gray-500 text-sm ${className}`, children: "No balance data" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-white ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2", children: "Balances" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-700", children: "ToroG" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium", children: (0, import_sdk_adapter.formatToroCurrency)(data.toroGBalance, "TORO") })
    ] }),
    (showAll || parseFloat(data.ngnBalance) > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "NGN" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (0, import_sdk_adapter.formatToroCurrency)(data.ngnBalance, "NGN") })
    ] }),
    (showAll || parseFloat(data.usdBalance) > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "USD" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (0, import_sdk_adapter.formatToroCurrency)(data.usdBalance, "USD") })
    ] }),
    (showAll || parseFloat(data.kshBalance) > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "KSH" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (0, import_sdk_adapter.formatToroCurrency)(data.kshBalance, "KSH") })
    ] })
  ] });
};

// src/ToroTokenBalance.tsx
var import_react2 = require("@reactforge/react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ToroTokenBalance = ({ address, className = "" }) => {
  const { data, loading, error } = (0, import_react2.useToroTokenBalance)(address);
  if (loading) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `animate-pulse bg-gray-200 h-10 w-48 rounded ${className}` });
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `text-red-500 text-sm ${className}`, children: "Error loading token balance" });
  if (!data) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `flex items-center gap-2 p-3 border rounded-lg bg-gray-50 ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "text-xl font-bold text-gray-900", children: [
      data.balance,
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-sm font-normal text-gray-500", children: data.symbol || "TOROG" })
    ] }),
    data.name && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-xs text-gray-400", children: data.name })
  ] }) });
};

// src/ToroTransactionList.tsx
var import_react3 = require("@reactforge/react");
var import_sdk_adapter2 = require("@reactforge/sdk-adapter");
var import_jsx_runtime3 = require("react/jsx-runtime");
var ToroTransactionList = ({ address, count = 10, className = "" }) => {
  const { data, loading, error } = (0, import_react3.useToroTransactions)(address, count);
  if (loading) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `p-4 text-gray-500 ${className}`, children: "Loading transactions..." });
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `p-4 text-red-500 ${className}`, children: "Error loading transactions" });
  if (!data || data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `p-4 text-gray-500 ${className}`, children: "No transactions found." });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `overflow-x-auto ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("table", { className: "w-full text-sm text-left", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { className: "px-4 py-3", children: "Hash" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { className: "px-4 py-3", children: "Amount" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { className: "px-4 py-3", children: "From" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { className: "px-4 py-3", children: "To" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { className: "px-4 py-3", children: "Status" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("tbody", { children: data.map((rawTx, i) => {
      const tx = (0, import_sdk_adapter2.formatToroTransaction)(rawTx);
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { className: "border-b hover:bg-gray-50", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { className: "px-4 py-3 font-mono text-blue-600", children: (0, import_sdk_adapter2.shortenAddress)(tx.hash) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { className: "px-4 py-3 font-medium", children: [
          tx.amount,
          " ",
          tx.currency
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { className: "px-4 py-3 font-mono", children: (0, import_sdk_adapter2.shortenAddress)(tx.from) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { className: "px-4 py-3 font-mono", children: (0, import_sdk_adapter2.shortenAddress)(tx.to) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { className: "px-4 py-3", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${tx.status === "success" ? "bg-green-100 text-green-800" : tx.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, children: tx.status }) })
      ] }, tx.hash || i);
    }) })
  ] }) });
};

// src/ToroTransactionStatus.tsx
var import_react4 = require("@reactforge/react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var ToroTransactionStatus = ({ hash, className = "" }) => {
  const { status, loading, error } = (0, import_react4.useToroTransactionStatus)(hash);
  if (loading) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `text-gray-500 animate-pulse ${className}`, children: "Checking status..." });
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `text-red-500 ${className}`, children: "Status unknown" });
  let colorClass = "bg-gray-100 text-gray-800";
  if (status === "success") colorClass = "bg-green-100 text-green-800";
  if (status === "failed") colorClass = "bg-red-100 text-red-800";
  if (status === "pending") colorClass = "bg-yellow-100 text-yellow-800";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`, children: status });
};

// src/ToroWallet.tsx
var import_react5 = require("@reactforge/react");
var import_sdk_adapter3 = require("@reactforge/sdk-adapter");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ToroWallet = ({ className = "" }) => {
  const { activeAddress, setActiveAddress } = (0, import_react5.useToroContext)();
  if (!activeAddress) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 ${className}`, children: [
      "No active wallet connected. Use ",
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { children: "useToroContext().connectWallet()" }),
      " to set one up."
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `flex items-center justify-between p-3 border rounded-lg bg-gray-50 ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs", children: "W" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-xs text-gray-500", children: "Connected Wallet" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-sm font-mono font-medium text-gray-900", children: (0, import_sdk_adapter3.shortenAddress)(activeAddress, 8, 6) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var import_react6 = __toESM(require("react"));
var import_react7 = require("@reactforge/react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var ToroTNS = ({ className = "", defaultMode = "resolve" }) => {
  const [mode, setMode] = (0, import_react6.useState)(defaultMode);
  const [input, setInput] = (0, import_react6.useState)("");
  const [debouncedInput, setDebouncedInput] = (0, import_react6.useState)("");
  import_react6.default.useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), 500);
    return () => clearTimeout(timer);
  }, [input]);
  const { data: addressData, loading: resolveLoading, error: resolveError } = (0, import_react7.useToroTNSResolve)(
    mode === "resolve" ? debouncedInput : void 0
  );
  const { data: nameData, loading: lookupLoading, error: lookupError } = (0, import_react7.useToroTNSLookup)(
    mode === "lookup" ? debouncedInput : void 0
  );
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `p-4 border rounded-lg bg-white shadow-sm max-w-md ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: mode === "resolve" ? "TNS Name (e.g. alice)" : "Toronet Address" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "min-h-[3rem] p-3 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center", children: [
      mode === "resolve" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        resolveLoading && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-gray-500 animate-pulse", children: "Resolving..." }),
        resolveError && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-red-500", children: "Name not found" }),
        !resolveLoading && !resolveError && addressData && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex flex-col w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-xs text-gray-500 mb-1", children: "Resolved Address:" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm font-mono font-medium break-all", children: addressData })
        ] }),
        !resolveLoading && !resolveError && !addressData && debouncedInput && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-gray-400", children: "Type a complete name..." })
      ] }),
      mode === "lookup" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        lookupLoading && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-gray-500 animate-pulse", children: "Looking up..." }),
        lookupError && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-red-500", children: "No name found for address" }),
        !lookupLoading && !lookupError && nameData && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex flex-col w-full items-center text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-xs text-gray-500 mb-1", children: "TNS Name:" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-lg font-bold text-gray-900", children: nameData })
        ] }),
        !lookupLoading && !lookupError && !nameData && debouncedInput && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-gray-400", children: "Enter a valid address..." })
      ] })
    ] })
  ] });
};

// src/ToroBridgeStatus.tsx
var import_react8 = require("@reactforge/react");
var import_sdk_adapter4 = require("@reactforge/sdk-adapter");
var import_jsx_runtime7 = require("react/jsx-runtime");
var ToroBridgeStatus = ({ address, className = "" }) => {
  const { balance: solBalance, loading: solLoading } = (0, import_react8.useToroBridgeBalance)(import_sdk_adapter4.BridgeNetwork.Solana, address);
  const { balance: baseBalance, loading: baseLoading } = (0, import_react8.useToroBridgeBalance)(import_sdk_adapter4.BridgeNetwork.Base, address);
  const { balance: polyBalance, loading: polyLoading } = (0, import_react8.useToroBridgeBalance)(import_sdk_adapter4.BridgeNetwork.Polygon, address);
  const { balance: bscBalance, loading: bscLoading } = (0, import_react8.useToroBridgeBalance)(import_sdk_adapter4.BridgeNetwork.BSC, address);
  const { balance: arbBalance, loading: arbLoading } = (0, import_react8.useToroBridgeBalance)(import_sdk_adapter4.BridgeNetwork.Arbitrum, address);
  const chains = [
    { name: "Solana", loading: solLoading, balance: solBalance },
    { name: "Base", loading: baseLoading, balance: baseBalance },
    { name: "Polygon", loading: polyLoading, balance: polyBalance },
    { name: "BSC", loading: bscLoading, balance: bscBalance },
    { name: "Arbitrum", loading: arbLoading, balance: arbBalance }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: `p-4 border rounded-lg bg-white shadow-sm ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("h3", { className: "text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "\u{1F309}" }),
      " Bridge Balances"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "grid gap-2", children: chains.map((chain) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-sm text-gray-600 font-medium", children: chain.name }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "text-sm", children: chain.loading ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-gray-400 animate-pulse", children: "Loading..." }) : chain.balance ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "font-mono text-gray-900", children: [
        (0, import_sdk_adapter4.formatToroAmount)(chain.balance),
        " TORO"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-gray-400", children: "---" }) })
    ] }, chain.name)) })
  ] });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToroBalance,
  ToroBridgeStatus,
  ToroTNS,
  ToroTokenBalance,
  ToroTransactionList,
  ToroTransactionStatus,
  ToroWallet
});
