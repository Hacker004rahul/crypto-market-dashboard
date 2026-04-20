import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMarkets } from '../api/coinGecko';
import { fallbackMarkets } from '../data/fallbackMarkets';

const REFRESH_MS = 60_000;
const CACHE_KEY = 'crypto-dashboard-market-cache';

function readCachedMarkets() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    if (Array.isArray(cached)) {
      return cached;
    }

    return Array.isArray(cached.markets) ? cached.markets : [];
  } catch {
    return [];
  }
}

function cacheMarkets(markets) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      savedAt: new Date().toISOString(),
      markets,
    }),
  );
}

export function useCryptoMarkets() {
  const [assets, setAssets] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [flashIds, setFlashIds] = useState(new Set());
  const [dataMode, setDataMode] = useState('loading');
  const previousPrices = useRef(new Map());
  const currentAssets = useRef([]);
  const flashTimer = useRef(null);

  const loadMarkets = useCallback(async ({ background = false } = {}) => {
    const controller = new AbortController();

    try {
      if (background) {
        setIsRefreshing(true);
      } else {
        setStatus('loading');
      }

      const nextAssets = await fetchMarkets({ signal: controller.signal });
      const changedIds = new Set();

      nextAssets.forEach((asset) => {
        const previous = previousPrices.current.get(asset.id);
        if (previous !== undefined && previous !== asset.current_price) {
          changedIds.add(asset.id);
        }
      });

      previousPrices.current = new Map(nextAssets.map((asset) => [asset.id, asset.current_price]));
      currentAssets.current = nextAssets;
      setAssets(nextAssets);
      cacheMarkets(nextAssets);
      setError('');
      setStatus('success');
      setDataMode('live');
      setLastUpdated(new Date());

      if (changedIds.size > 0) {
        setFlashIds(changedIds);
        window.clearTimeout(flashTimer.current);
        flashTimer.current = window.setTimeout(() => setFlashIds(new Set()), 1400);
      }
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        if (currentAssets.current.length > 0) {
          setError('');
          setStatus('success');
          return;
        }

        const cachedMarkets = readCachedMarkets();
        const backupMarkets = cachedMarkets.length > 0 ? cachedMarkets : fallbackMarkets;

        currentAssets.current = backupMarkets;
        setAssets(backupMarkets);
        setDataMode(cachedMarkets.length > 0 ? 'cached' : 'demo');
        setError(
          cachedMarkets.length > 0
            ? ''
            : 'Live CoinGecko data is unavailable. Showing demo market data so the dashboard remains usable.',
        );
        setStatus('success');
      }
    } finally {
      setIsRefreshing(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function initialLoad() {
      try {
        setStatus('loading');
        const nextAssets = await fetchMarkets({ signal: controller.signal });
        previousPrices.current = new Map(nextAssets.map((asset) => [asset.id, asset.current_price]));
        currentAssets.current = nextAssets;
        setAssets(nextAssets);
        cacheMarkets(nextAssets);
        setStatus('success');
        setDataMode('live');
        setLastUpdated(new Date());
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          const cachedMarkets = readCachedMarkets();
          const backupMarkets = cachedMarkets.length > 0 ? cachedMarkets : fallbackMarkets;

          previousPrices.current = new Map(backupMarkets.map((asset) => [asset.id, asset.current_price]));
          currentAssets.current = backupMarkets;
          setAssets(backupMarkets);
          setDataMode(cachedMarkets.length > 0 ? 'cached' : 'demo');
          setError(
            cachedMarkets.length > 0
              ? ''
              : 'Live CoinGecko data is unavailable. Showing demo market data so the dashboard remains usable.',
          );
          setStatus('success');
          setLastUpdated(new Date());
        }
      }
    }

    initialLoad();
    const interval = window.setInterval(() => {
      loadMarkets({ background: true });
    }, REFRESH_MS);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.clearTimeout(flashTimer.current);
    };
  }, [loadMarkets]);

  return {
    assets,
    status,
    error,
    lastUpdated,
    isRefreshing,
    flashIds,
    dataMode,
    refresh: () => loadMarkets({ background: assets.length > 0 }),
  };
}
