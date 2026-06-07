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

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Minimal XHR interface — avoids pulling in DOM lib types so the SDK
 * compiles without `lib: ["DOM"]`.  At runtime this is React Native's
 * `XMLHttpRequest` (Libraries/Network/XMLHttpRequest.js) which passes
 * `send(body)` through to `RCTNetworking` without stripping the body
 * for GET/HEAD, unlike the WHATWG `fetch` spec.
 *
 * @internal
 */
interface XHR {
  open(method: string, url: string, async: boolean): void;
  setRequestHeader(key: string, value: string): void;
  send(body?: string | null): void;
  abort(): void;
  getAllResponseHeaders(): string;
  responseText: string;
  response: unknown;
  status: number;
  statusText: string;
  timeout: number;
  responseType: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  ontimeout: (() => void) | null;
  onabort: (() => void) | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _global = globalThis as any;
const _XHR: (new () => XHR) | null =
  typeof _global.XMLHttpRequest !== 'undefined'
    ? _global.XMLHttpRequest
    : null;

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
      return new Promise((resolve, reject) => {
        const XHRCtor = _XHR;
        if (!XHRCtor) {
          // No XHR available — fall back to the original adapter chain
          const adapter =
            typeof fallbackAdapter === 'function'
              ? fallbackAdapter
              : axios.getAdapter(fallbackAdapter ?? ['xhr', 'http', 'fetch']);
          adapter(config).then(resolve, reject);
          return;
        }

        const xhr = new XHRCtor();
        xhr.open('GET', config.url!, true);

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
          const responseHeaders: Record<string, string> = {};
          const allHeaders = xhr.getAllResponseHeaders();
          if (allHeaders) {
            for (const line of allHeaders.trim().split(/[\r\n]+/)) {
              const parts = line.split(': ');
              if (parts.length >= 2) {
                const key = parts.shift()!.toLowerCase();
                responseHeaders[key] = parts.join(': ');
              }
            }
          }

          // Parse response body (axios normally handles this; we mirror it)
          let responseData: unknown = xhr.responseText;
          if (
            config.responseType === 'json' ||
            (responseHeaders['content-type'] ?? '').includes('application/json')
          ) {
            try {
              responseData = JSON.parse(xhr.responseText);
            } catch {
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
          } else {
            reject(
              new AxiosError(
                `Request failed with status code ${xhr.status}`,
                AxiosError.ERR_BAD_RESPONSE,
                config,
                xhr,
                {
                  data: responseData,
                  status: xhr.status,
                  statusText: xhr.statusText,
                  headers: responseHeaders as unknown as Record<string, string>,
                  config,
                },
              ),
            );
          }
        };

        xhr.onerror = () => {
          reject(
            new AxiosError(
              'Network Error',
              AxiosError.ERR_NETWORK,
              config,
              xhr,
            ),
          );
        };

        xhr.ontimeout = () => {
          reject(
            new AxiosError(
              `timeout of ${config.timeout}ms exceeded`,
              AxiosError.ETIMEDOUT,
              config,
              xhr,
            ),
          );
        };

        xhr.onabort = () => {
          reject(
            new AxiosError(
              'Request aborted',
              AxiosError.ECONNABORTED,
              config,
              xhr,
            ),
          );
        };

        // Handle cancellation
        if (config.signal) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (config.signal as any).addEventListener('abort', () => xhr.abort());
          if (config.signal.aborted) {
            xhr.abort();
            return;
          }
        }

        // axios's transformRequest already stringified the data, so
        // config.data is a string at this point — send it as-is.
        xhr.send(config.data as string | null);
      });
    }

    // --- all other requests use the original adapter chain ---
    const adapter =
      typeof fallbackAdapter === 'function'
        ? fallbackAdapter
        : axios.getAdapter(fallbackAdapter ?? ['xhr', 'http', 'fetch']);
    return adapter(config);
  };
}
