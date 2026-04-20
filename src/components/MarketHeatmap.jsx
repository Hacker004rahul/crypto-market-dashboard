import { formatCompactCurrency } from '../utils/formatters';

export function MarketHeatmap({ assets, onSelect }) {
  const visibleAssets = assets.slice(0, 12);
  const largestCap = Math.max(...visibleAssets.map((asset) => asset.market_cap ?? 0), 1);

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black">Market Pulse</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Compact heat strip: width follows market cap, color follows 24h move.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Loss
          <span className="ml-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Gain
        </div>
      </div>

      <div className="mt-4 flex h-24 gap-1 overflow-hidden rounded-md bg-stone-100 p-1 dark:bg-neutral-800">
        {visibleAssets.map((asset) => {
          const change = asset.price_change_percentage_24h ?? 0;
          const flex = Math.max(0.65, ((asset.market_cap ?? 0) / largestCap) * 4);
          const intensity = Math.min(0.95, 0.35 + Math.abs(change) / 18);

          return (
            <button
              className={`group relative min-w-12 rounded-md px-2 py-2 text-left transition hover:z-10 hover:scale-[1.03] ${
                change >= 0
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
              key={asset.id}
              onClick={() => onSelect(asset)}
              style={{ flex, opacity: intensity }}
              type="button"
              title={`${asset.name}: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%, ${formatCompactCurrency(asset.market_cap)}`}
            >
              <p className="truncate text-sm font-black">{asset.symbol.toUpperCase()}</p>
              <p className="mt-1 truncate text-xs font-bold">
                {change >= 0 ? '+' : ''}
                {change.toFixed(1)}%
              </p>
              <div className="pointer-events-none absolute bottom-2 left-2 right-2 hidden rounded bg-black/70 px-2 py-1 text-xs font-bold text-white group-hover:block">
                {formatCompactCurrency(asset.market_cap)}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
