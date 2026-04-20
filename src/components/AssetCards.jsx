import { ChangeBadge } from './ChangeBadge';
import { Sparkline } from './Sparkline';
import { StarIcon } from './StarIcon';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters';

export function AssetCards({ assets, onSelect, flashIds, watchlistSet, onToggleWatchlist }) {
  return (
    <div className="grid gap-3 lg:hidden">
      {assets.map((asset) => (
        <article
          className="rounded-md border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
          key={asset.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img alt="" className="h-10 w-10 shrink-0 rounded-full" src={asset.image} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-neutral-950 dark:text-white">{asset.name}</p>
                <p className="text-sm uppercase text-neutral-500 dark:text-neutral-400">{asset.symbol}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                aria-label={`${watchlistSet.has(asset.id) ? 'Remove' : 'Add'} ${asset.name} ${
                  watchlistSet.has(asset.id) ? 'from' : 'to'
                } watchlist`}
                className={`h-9 w-9 rounded-md border text-base font-bold transition ${
                  watchlistSet.has(asset.id)
                    ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-300 dark:bg-amber-300/15 dark:text-amber-200'
                    : 'border-stone-300 text-neutral-400 hover:border-amber-400 hover:text-amber-600 dark:border-neutral-700 dark:hover:border-amber-300 dark:hover:text-amber-200'
                }`}
                onClick={() => onToggleWatchlist(asset.id)}
                type="button"
              >
                <span className="flex items-center justify-center">
                  <StarIcon filled={watchlistSet.has(asset.id)} />
                </span>
              </button>
              <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Price</p>
              <p
                className={`mt-1 font-bold text-neutral-950 transition dark:text-white ${
                  flashIds.has(asset.id) ? 'rounded bg-amber-100 px-1 dark:bg-amber-400/15' : ''
                }`}
              >
                {formatCurrency(asset.current_price)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Market cap</p>
              <p className="mt-1 font-bold text-neutral-950 dark:text-white">{formatCompactCurrency(asset.market_cap)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-neutral-800">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">7d trend</p>
              <div className="mt-1">
                <ChangeBadge value={asset.price_change_percentage_7d_in_currency ?? 0} />
              </div>
            </div>
            <Sparkline
              positive={(asset.price_change_percentage_7d_in_currency ?? asset.price_change_percentage_24h ?? 0) >= 0}
              prices={asset.sparkline_in_7d?.price}
            />
          </div>
          <button
            className="mt-4 w-full rounded-md bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            onClick={() => onSelect(asset)}
            type="button"
          >
            View details
          </button>
        </article>
      ))}
    </div>
  );
}
