import { ChangeBadge } from './ChangeBadge';
import { Sparkline } from './Sparkline';
import { formatCurrency } from '../utils/formatters';

export function WatchlistStrip({ assets, watchlistSet, onSelect }) {
  const watchedAssets = assets.filter((asset) => watchlistSet.has(asset.id)).slice(0, 6);

  if (watchedAssets.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">My Watchlist</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pinned coins for faster monitoring</p>
        </div>
        <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 dark:bg-amber-300/15 dark:text-amber-200">
          {watchedAssets.length} tracked
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {watchedAssets.map((asset) => (
          <button
            className="rounded-md border border-stone-200 p-3 text-left transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            key={asset.id}
            onClick={() => onSelect(asset)}
            type="button"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <img alt="" className="h-8 w-8 rounded-full" src={asset.image} />
                <div className="min-w-0">
                  <p className="truncate font-bold">{asset.name}</p>
                  <p className="text-sm uppercase text-neutral-500 dark:text-neutral-400">{asset.symbol}</p>
                </div>
              </div>
              <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-black">{formatCurrency(asset.current_price)}</span>
              <Sparkline
                positive={(asset.price_change_percentage_7d_in_currency ?? 0) >= 0}
                prices={asset.sparkline_in_7d?.price}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
