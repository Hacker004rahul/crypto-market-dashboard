import { ChangeBadge } from './ChangeBadge';
import { formatCurrency } from '../utils/formatters';

export function MarketMovers({ assets, onSelect }) {
  if (assets.length === 0) {
    return null;
  }

  const sortedByChange = [...assets].sort(
    (first, second) => (second.price_change_percentage_24h ?? 0) - (first.price_change_percentage_24h ?? 0),
  );
  const movers = [
    { label: 'Top mover', asset: sortedByChange[0] },
    { label: 'Biggest pullback', asset: sortedByChange[sortedByChange.length - 1] },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2">
      {movers.map(({ label, asset }) => (
        <button
          className="rounded-md border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
          key={label}
          onClick={() => onSelect(asset)}
          type="button"
        >
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{label}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img alt="" className="h-10 w-10 rounded-full" src={asset.image} />
              <div className="min-w-0">
                <p className="truncate font-bold text-neutral-950 dark:text-white">{asset.name}</p>
                <p className="text-sm uppercase text-neutral-500 dark:text-neutral-400">
                  {asset.symbol} at {formatCurrency(asset.current_price)}
                </p>
              </div>
            </div>
            <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
          </div>
        </button>
      ))}
    </section>
  );
}
