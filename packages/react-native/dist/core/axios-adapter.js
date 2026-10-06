"use strict";
/**
 * @fileoverview
 * Patches axios to use a raw XMLHttpRequest for GET requests that carry a
 * JSON body.
 *
 * **Why this exists:**
 * React Native's `fetch` (backed by `whatwg-fetch`) follows the WHATWG Fetch
 * spec which mandates throwing a TypeError for GET/HEAD requests with a body.
 * torosdk (v0.2.0) uses `axios(config)` with `method: "get"` AND a JSON
 * `data` payload for balance and other read-only queries.  The Toronet API
 * **only** accepts GET-with-JSON-body — POST returns 404 and query
 * parameters are not parsed.
 *
 * React Native's XMLHttpRequest does *not* have the same restriction — it
 * passes `data` directly to `RCTNetworking.sendRequest()` without checking
 * the HTTP method.  So we route GET+body requests through a raw XHR instead
 * of the default adapter chain (which would use `fetch` via whatwg-fetch).
 *
 * Called automatically by {@link createConfig} — users don't need to
 * import this file directly.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAxiosAdapter = setupAxiosAdapter;
const axios_1 = __importStar(require("axios"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _global = globalThis;
const _XHR = typeof _global.XMLHttpRequest !== 'undefined'
    ? _global.XMLHttpRequest
    : null;
/**
 * Lazily resolve the native NWConnection module.
 *
 * **Why lazy:** importing `react-native` at the top level (and the
 * `require("react-native")` it compiles to) runs during the Metro module
 * initialisation chain.  When `axios-adapter.js` is imported transitively
 * from a React component module (e.g. provider → config →
 * axios-adapter), the `react-native` require can interfere with the
 * `react` module reference captured by the component's closure, causing a
 * "Cannot read property 'useMemo' of null" error at render time.
 *
 * By deferring the require to first use (inside `setupAxiosAdapter`),
 * we keep the module initialisation order clean.
 */
let _nativeRawRequestCache;
function getNativeRawRequest() {
    if (_nativeRawRequestCache !== undefined) {
        return _nativeRawRequestCache;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Platform, NativeModules } = require('react-native');
        _nativeRawRequestCache =
            Platform.OS === 'ios' &&
                NativeModules.ToroNetworking &&
                typeof NativeModules.ToroNetworking.rawRequest === 'function'
                ? NativeModules.ToroNetworking.rawRequest
                : null;
    }
    catch {
        _nativeRawRequestCache = null;
    }
    return _nativeRawRequestCache;
}
/**
 * Build a raw HTTP/1.1 request string from an axios config.
 *
 * Used by the native NWConnection transport which needs raw bytes.
 *
 * @internal
 */
function buildRawHttpRequest(config) {
    const url = new URL(config.url);
    const path = url.pathname + url.search;
    const host = url.hostname;
    const useTls = url.protocol === 'https:';
    const port = url.port
        ? parseInt(url.port, 10)
        : useTls
            ? 443
            : 80;
    const lines = [];
    lines.push(`GET ${path || '/'} HTTP/1.1`);
    lines.push(`Host: ${host}`);
    if (config.headers) {
        for (const key of Object.keys(config.headers)) {
            const val = config.headers[key];
            if (val != null && key.toLowerCase() !== 'host') {
                lines.push(`${key}: ${String(val)}`);
            }
        }
    }
    // Body
    const body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
    lines.push(`Content-Length: ${body.length}`);
    lines.push('Connection: close');
    lines.push(''); // blank line
    lines.push('');
    const httpRequest = lines.join('\r\n') + body;
    return { host, port, useTls, httpRequest };
}
/** Module-level debug flag — set by {@link setupAxiosAdapter}. */
let _debug = false;
/**
 * Activate the custom adapter.
 *
 * Called once by {@link createConfig} at app startup.
 * Uses `axios.defaults.adapter` as the backwards-compatible hook
 * (available since axios 0.x).
 *
 * The adapter only intercepts GET requests that carry a JSON body;
 * all other requests (POST, PUT, GET-without-body, etc.) pass
 * through to the original adapter chain unchanged.
 *
 * On iOS, when the native ToroNetworking module is linked, the adapter
 * routes GET+body requests through NWConnection (raw TCP+TLS), which
 * bypasses CFNetwork's Darwin 25 restriction on GET+body.
 *
 * @param debug - When `true`, transport selection and request/response
 *   traces are logged to the console.  Off by default.
 *
 * @internal — exported for testing; users should rely on `createConfig`.
 */
function setupAxiosAdapter(debug) {
    _debug = debug === true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fallbackAdapter = axios_1.default.defaults.adapter;
    // Resolve native module lazily — NOT at import time (see getNativeRawRequest JSDoc)
    const nativeRawRequest = getNativeRawRequest();
    if (_debug) {
        console.log('[torosdk-expo:adapter] setupAxiosAdapter() called', '— XHR available:', !!_XHR, 'nativeRawRequest available:', !!nativeRawRequest, 'fallbackAdapter:', typeof fallbackAdapter);
    }
    axios_1.default.defaults.adapter = async function customAdapter(config) {
        // Only intercept GET requests that carry a body
        if (config.method?.toLowerCase() === 'get' && config.data != null) {
            if (_debug) {
                console.log('[torosdk-expo:adapter] INTERCEPTING GET+body:', config.url, 'data len:', typeof config.data === 'string'
                    ? config.data.length
                    : JSON.stringify(config.data).length, 'nativeRaw:', !!nativeRawRequest);
            }
            // ── Native NWConnection path (iOS, bypasses CFNetwork) ──────
            if (nativeRawRequest) {
                try {
                    const raw = buildRawHttpRequest(config);
                    if (_debug)
                        console.log('[torosdk-expo:adapter] → using native NWConnection to', raw.host, ':', raw.port);
                    // Race native request against a timeout so a hung connection
                    // doesn't block the fallback path forever.
                    const result = await Promise.race([
                        nativeRawRequest(raw),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('native request timed out')), 30000)),
                    ]);
                    if (_debug)
                        console.log('[torosdk-expo:adapter] ← native response status:', result.statusCode);
                    // Parse response body
                    let responseData = result.body;
                    const contentType = result.headers['content-type'] ?? '';
                    if (contentType.includes('application/json')) {
                        try {
                            responseData = JSON.parse(result.body);
                        }
                        catch {
                            responseData = result.body;
                        }
                    }
                    if (result.statusCode >= 200 && result.statusCode < 300) {
                        return {
                            data: responseData,
                            status: result.statusCode,
                            statusText: 'OK',
                            headers: result.headers,
                            config,
                        };
                    }
                    else {
                        throw new axios_1.AxiosError(`Request failed with status code ${result.statusCode}`, axios_1.AxiosError.ERR_BAD_RESPONSE, config, undefined, {
                            data: responseData,
                            status: result.statusCode,
                            statusText: '',
                            headers: result.headers,
                            config,
                        });
                    }
                }
                catch (err) {
                    // Only reject AxiosErrors directly; wrap others
                    if (err instanceof axios_1.AxiosError)
                        throw err;
                    console.warn('[torosdk-expo:adapter] native request failed:', err?.message, '— falling back to XHR');
                    // Fall through to XHR below
                }
            }
            // ── XHR path (fallback for iOS or primary for Android) ──────
            return new Promise((resolve, reject) => {
                const XHRCtor = _XHR;
                if (!XHRCtor) {
                    // No XHR available — fall back to the original adapter chain
                    const adapter = typeof fallbackAdapter === 'function'
                        ? fallbackAdapter
                        : axios_1.default.getAdapter(fallbackAdapter ?? ['xhr', 'http', 'fetch']);
                    adapter(config).then(resolve, reject);
                    return;
                }
                const xhr = new XHRCtor();
                xhr.open('GET', config.url, true);
                // Copy headers from axios config to XHR
                if (config.headers) {
                    for (const key of Object.keys(config.headers)) {
                        const val = config.headers[key];
                        if (val != null) {
                            xhr.setRequestHeader(key, String(val));
                        }
                    }
                }
                // Apply timeout
                if (config.timeout && config.timeout > 0) {
                    xhr.timeout = config.timeout;
                }
                // Apply responseType
                if (config.responseType) {
                    xhr.responseType = config.responseType;
                }
                xhr.onload = () => {
                    // Build axios-shaped response headers
                    const responseHeaders = {};
                    const allHeaders = xhr.getAllResponseHeaders();
                    if (allHeaders) {
                        for (const line of allHeaders.trim().split(/[\r\n]+/)) {
                            const parts = line.split(': ');
                            if (parts.length >= 2) {
                                const key = parts.shift().toLowerCase();
                                responseHeaders[key] = parts.join(': ');
                            }
                        }
                    }
                    // Parse response body (axios normally handles this; we mirror it)
                    let responseData = xhr.responseText;
                    if (config.responseType === 'json' ||
                        (responseHeaders['content-type'] ?? '').includes('application/json')) {
                        try {
                            responseData = JSON.parse(xhr.responseText);
                        }
                        catch {
                            responseData = xhr.responseText;
                        }
                    }
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve({
                            data: responseData,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: responseHeaders,
                            config,
                            request: xhr,
                        });
                    }
                    else {
                        reject(new axios_1.AxiosError(`Request failed with status code ${xhr.status}`, axios_1.AxiosError.ERR_BAD_RESPONSE, config, xhr, {
                            data: responseData,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: responseHeaders,
                            config,
                        }));
                    }
                };
                xhr.onerror = () => {
                    console.warn('[torosdk-expo:adapter] XHR onerror fired for:', config.url, 'status:', xhr.status, 'responseText:', xhr.responseText?.slice(0, 200));
                    reject(new axios_1.AxiosError('Network Error', axios_1.AxiosError.ERR_NETWORK, config, xhr));
                };
                xhr.ontimeout = () => {
                    reject(new axios_1.AxiosError(`timeout of ${config.timeout}ms exceeded`, axios_1.AxiosError.ETIMEDOUT, config, xhr));
                };
                xhr.onabort = () => {
                    reject(new axios_1.AxiosError('Request aborted', axios_1.AxiosError.ECONNABORTED, config, xhr));
                };
                // Handle cancellation
                if (config.signal) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    config.signal.addEventListener('abort', () => xhr.abort());
                    if (config.signal.aborted) {
                        xhr.abort();
                        return;
                    }
                }
                // axios's transformRequest already stringified the data, so
                // config.data is a string at this point — send it as-is.
                xhr.send(config.data);
            });
        }
        // --- all other requests use the original adapter chain ---
        if (_debug)
            console.log('[torosdk-expo:adapter] BYPASS for', config.method, config.url, '(no GET+body)');
        const adapter = typeof fallbackAdapter === 'function'
            ? fallbackAdapter
            : axios_1.default.getAdapter(fallbackAdapter ?? ['xhr', 'http', 'fetch']);
        return adapter(config);
    };
}
//# sourceMappingURL=axios-adapter.js.map