import { ChangeBadge } from './ChangeBadge';
import { Sparkline } from './Sparkline';
import { formatCompactCurrency, formatCurrency, formatNumber } from '../utils/formatters';

export function CompareCoins({ assets, compareIds, onToggleCompare }) {
  const comparedAssets = compareIds.map((id) => assets.find((asset) => asset.id === id)).filter(Boolean);

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-lg font-black">Compare Coins</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pick up to 3 assets for side-by-side metrics.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {assets.slice(0, 10).map((asset) => {
            const active = compareIds.includes(asset.id);
            return (
              <button
                className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
                    : 'border-stone-300 text-neutral-600 hover:border-neutral-500 dark:border-neutral-700 dark:text-neutral-300'
                }`}
                key={asset.id}
                onClick={() => onToggleCompare(asset.id)}
                type="button"
              >
                {asset.symbol.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {comparedAssets.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {comparedAssets.map((asset) => (
            <div className="rounded-md border border-stone-200 p-4 dark:border-neutral-800" key={asset.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <img alt="" className="h-9 w-9 rounded-full" src={asset.image} />
                  <div className="min-w-0">
                    <p className="truncate font-black">{asset.name}</p>
                    <p className="text-sm uppercase text-neutral-500 dark:text-neutral-400">{asset.symbol}</p>
                  </div>
                </div>
                <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Price</span><b>{formatCurrency(asset.current_price)}</b></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Market cap</span><b>{formatCompactCurrency(asset.market_cap)}</b></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Volume</span><b>{formatCompactCurrency(asset.total_volume)}</b></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Supply</span><b>{formatNumber(asset.circulating_supply)}</b></div>
              </div>
              <div className="mt-3 flex justify-end">
                <Sparkline
                  positive={(asset.price_change_percentage_7d_in_currency ?? 0) >= 0}
                  prices={asset.sparkline_in_7d?.price}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-stone-100 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Select coins above to build a quick comparison.
        </p>
      )}
    </section>
  );
}
