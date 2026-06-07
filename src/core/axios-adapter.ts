/**
 * @fileoverview
 * Patches axios to use `fetch` for GET requests that carry a JSON body.
 *
 * **Why this exists:**
 * React Native's XMLHttpRequest polyfill follows the XMLHttpRequest spec
 * which mandates that `send(body)` set `body` to `null` for GET/HEAD
 * methods.  torosdk (v0.2.0) uses `axios(config)` with `method: "get"` AND
 * a JSON `data` payload for balance and other read-only queries.  The
 * Toronet API **only** accepts GET-with-JSON-body — POST returns 404 and
 * query parameters are not parsed.
 *
 * React Native's `fetch` (backed by NSURLSession on iOS) does *not* have
 * the same restriction, so we route GET+body requests through fetch
 * instead of XHR.
 *
 * Called automatically by {@link createConfig} — users don't need to
 * import this file directly.
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

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
 * @internal — exported for testing; users should rely on `createConfig`.
 */
export function setupAxiosAdapter(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fallbackAdapter = axios.defaults.adapter as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios.defaults.adapter = async function customAdapter(
    config: InternalAxiosRequestConfig,
  ): Promise<any> {
    // Only intercept GET requests that carry a body
    if (config.method?.toLowerCase() === 'get' && config.data != null) {
      try {
        // Build fetch-compatible headers from axios config
        const fetchHeaders = new Headers();
        if (config.headers) {
          for (const key of Object.keys(config.headers)) {
            const val = config.headers[key];
            if (val != null) {
              fetchHeaders.set(key, String(val));
            }
          }
        }

        // --- perform the request via fetch ---
        const response = await fetch(config.url!, {
          method: 'GET',
          headers: fetchHeaders,
          body: JSON.stringify(config.data),
          signal: config.signal as AbortSignal | undefined,
        });

        // Parse response body
        const contentType = response.headers.get('content-type') ?? '';
        const data: unknown = contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        // Non-2xx → AxiosError (mirrors what the XHR adapter does)
        if (!response.ok) {
          throw new AxiosError(
            `Request failed with status code ${response.status}`,
            AxiosError.ERR_BAD_RESPONSE,
            config,
            null,
            {
              data,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers as unknown as Record<string, string>,
              config,
            },
          );
        }

        // Success → axios-shaped response object
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers as unknown as Record<string, string>,
          config,
          request: null,
        };
      } catch (error: unknown) {
        // Re-throw axios errors as-is
        if (axios.isAxiosError(error)) {
          throw error;
        }
        // Wrap native errors (e.g. TypeError from Network_Error) as AxiosError
        const message =
          error instanceof Error ? error.message : String(error);
        throw new AxiosError(
          `Network Error: ${message}`,
          AxiosError.ERR_NETWORK,
          config,
          null,
        );
      }
    }

    // --- all other requests use the original adapter chain ---
    const adapter =
      typeof fallbackAdapter === 'function'
        ? fallbackAdapter
        : axios.getAdapter(fallbackAdapter ?? ['xhr', 'http', 'fetch']);
    return adapter(config);
  };
}
