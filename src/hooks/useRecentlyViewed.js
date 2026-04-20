import { useLocalStorageState } from './useLocalStorageState';

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useLocalStorageState('crypto-dashboard-recently-viewed', []);

  function addRecent(assetId) {
    setRecentIds((current) => [assetId, ...current.filter((id) => id !== assetId)].slice(0, 8));
  }

  return { recentIds, addRecent };
}
