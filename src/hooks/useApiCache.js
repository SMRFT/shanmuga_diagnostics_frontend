import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import apiRequest from "../Components/Auth/apiRequest";

/**
 * Lightweight in-memory API caching layer.
 *
 * This is intentionally NOT backed by localStorage/sessionStorage - the cache
 * lives only in JS memory for the lifetime of the tab/session (a ref inside
 * CacheProvider). It is meant to avoid redundant re-fetching of the same data
 * when a user re-visits a screen shortly after leaving it, and to give
 * mutation flows (create/update/delete forms) an easy way to say "the list
 * this fed into is now stale".
 *
 * Usage:
 *   1. Wrap the app root once with <CacheProvider>...</CacheProvider>.
 *   2. In a read-heavy component, replace a manual useEffect+apiRequest fetch
 *      with `const { data, loading, error, refetch } = useCachedApi(url, params, options)`.
 *   3. After a mutation (create/update/delete) elsewhere, call
 *      `const { invalidate } = useCacheContext(); invalidate("some/url/fragment")`
 *      so the next visit to the list screen re-fetches instead of reading stale data.
 */

const DEFAULT_TTL = 60 * 1000; // 60 seconds

const CacheContext = createContext(null);

function buildCacheKey(url, params, method) {
  const normalizedMethod = (method || "GET").toUpperCase();
  const paramsPart = params ? JSON.stringify(params) : "";
  return `${normalizedMethod}:${url}:${paramsPart}`;
}

export function CacheProvider({ children }) {
  // key -> { data, timestamp }
  const cacheRef = useRef(new Map());

  const getEntry = useCallback((key) => cacheRef.current.get(key), []);

  const setEntryValue = useCallback((key, data) => {
    cacheRef.current.set(key, { data, timestamp: Date.now() });
  }, []);

  /**
   * Removes any cache entries whose key contains `urlOrKeyFragment`.
   * Pass the same url (or a distinctive substring of it, e.g. an endpoint
   * name) that was used with useCachedApi so the corresponding entries are
   * dropped. The next component that reads that url will fetch fresh data.
   */
  const invalidate = useCallback((urlOrKeyFragment) => {
    if (!urlOrKeyFragment) return;
    for (const key of Array.from(cacheRef.current.keys())) {
      if (key.includes(urlOrKeyFragment)) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  const invalidateAll = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const value = {
    getEntry,
    setEntryValue,
    invalidate,
    invalidateAll,
  };

  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
}

export function useCacheContext() {
  const ctx = useContext(CacheContext);
  if (!ctx) {
    throw new Error("useCacheContext must be used within a <CacheProvider>");
  }
  return ctx;
}

/**
 * useCachedApi
 *
 * @param {string|null} url - Full request URL (including any query string).
 *   Pass null/undefined/"" to skip fetching (e.g. while a dependent filter
 *   hasn't been chosen yet).
 * @param {Object|null} params - For GET requests this only affects the cache
 *   key (use it when the same url is reused with different logical filters
 *   that aren't already baked into the query string). For POST/PUT/PATCH/
 *   DELETE requests this is also sent as the request body, mirroring how
 *   apiRequest(url, method, data, headers) already works.
 * @param {Object} options
 *   - method: HTTP method, default "GET"
 *   - ttl: cache time-to-live in ms, default 60000
 *   - enabled: set false to skip auto-fetching entirely
 *   - headers: extra headers merged by apiRequest
 * @returns {{ data, loading, error, refetch: (forceRefresh?: boolean) => Promise }}
 *   `refetch()` bypasses the cache and re-hits the network - use this for
 *   manual "Refresh" buttons.
 */
export function useCachedApi(url, params = null, options = {}) {
  const { method = "GET", ttl = DEFAULT_TTL, enabled = true, headers = {} } =
    options;

  const { getEntry, setEntryValue } = useCacheContext();
  const cacheKey = buildCacheKey(url, params, method);

  const initialEntry = getEntry(cacheKey);
  const initialIsFresh =
    !!initialEntry && Date.now() - initialEntry.timestamp < ttl;

  const [data, setData] = useState(initialEntry ? initialEntry.data : null);
  const [loading, setLoading] = useState(
    !!url && enabled && !initialIsFresh
  );
  const [error, setError] = useState(null);

  // Guards against a slower, older request overwriting a newer one's result.
  const requestIdRef = useRef(0);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!url || !enabled) return null;

      const cached = getEntry(cacheKey);
      const isFresh = !!cached && Date.now() - cached.timestamp < ttl;

      if (cached && isFresh && !forceRefresh) {
        setData(cached.data);
        setLoading(false);
        setError(null);
        return cached.data;
      }

      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(
        method.toUpperCase()
      );
      const res = await apiRequest(
        url,
        method,
        isWriteMethod ? params : null,
        headers
      );

      // If a newer fetch has started (e.g. filters changed again) since this
      // one was kicked off, ignore this now-stale response.
      if (requestId !== requestIdRef.current) {
        return res;
      }

      if (res.success) {
        setEntryValue(cacheKey, res.data);
        setData(res.data);
        setError(null);
      } else {
        setError(res.error || "Request failed");
      }
      setLoading(false);
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, cacheKey, method, ttl, enabled]
  );

  useEffect(() => {
    fetchData();
    // Re-run whenever the effective cache key changes (url, method, or the
    // JSON-stringified params all feed into it) or when re-enabled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}

export default useCachedApi;
