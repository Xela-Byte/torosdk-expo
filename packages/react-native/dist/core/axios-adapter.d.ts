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
export declare function setupAxiosAdapter(debug?: boolean): void;
//# sourceMappingURL=axios-adapter.d.ts.map