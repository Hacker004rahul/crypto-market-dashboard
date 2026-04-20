import { ChangeBadge } from './ChangeBadge';
import { formatCurrency } from '../utils/formatters';

export function RecentlyViewed({ assets, recentIds, onSelect }) {
  const recentAssets = recentIds.map((id) => assets.find((asset) => asset.id === id)).filter(Boolean);

  if (recentAssets.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-black">Recently Viewed</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {recentAssets.map((asset) => (
          <button
            className="min-w-56 rounded-md border border-stone-200 p-3 text-left transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            key={asset.id}
            onClick={() => onSelect(asset)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <img alt="" className="h-8 w-8 rounded-full" src={asset.image} />
              <div className="min-w-0">
                <p className="truncate font-bold">{asset.name}</p>
                <p className="text-sm uppercase text-neutral-500 dark:text-neutral-400">{asset.symbol}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-black">{formatCurrency(asset.current_price)}</span>
              <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
