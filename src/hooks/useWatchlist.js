import { useEffect, useState } from 'react';

const STORAGE_KEY = 'crypto-dashboard-watchlist';

function readWatchlist() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlistIds, setWatchlistIds] = useState(readWatchlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  function toggleWatchlist(assetId) {
    setWatchlistIds((current) =>
      current.includes(assetId) ? current.filter((id) => id !== assetId) : [...current, assetId],
    );
  }

  return {
    watchlistIds,
    watchlistSet: new Set(watchlistIds),
    toggleWatchlist,
  };
}
