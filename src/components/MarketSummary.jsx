import { formatCompactCurrency, formatPercent } from '../utils/formatters';

export function MarketSummary({ assets }) {
  const totalMarketCap = assets.reduce((sum, asset) => sum + (asset.market_cap ?? 0), 0);
  const totalVolume = assets.reduce((sum, asset) => sum + (asset.total_volume ?? 0), 0);
  const gainers = assets.filter((asset) => asset.price_change_percentage_24h >= 0).length;
  const averageChange =
    assets.reduce((sum, asset) => sum + (asset.price_change_percentage_24h ?? 0), 0) / Math.max(assets.length, 1);

  const items = [
    { label: 'Tracked assets', value: assets.length },
    { label: 'Total market cap', value: formatCompactCurrency(totalMarketCap) },
    { label: '24h volume', value: formatCompactCurrency(totalVolume) },
    { label: 'Average 24h move', value: formatPercent(averageChange), tone: averageChange >= 0 ? 'up' : 'down' },
    { label: 'Assets in profit', value: `${gainers}/${assets.length}` },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <div
          className="rounded-md border border-stone-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          key={item.label}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</p>
          <p
            className={`mt-2 text-xl font-black ${
              item.tone === 'up'
                ? 'text-emerald-700 dark:text-emerald-300'
                : item.tone === 'down'
                  ? 'text-red-600 dark:text-red-300'
                  : 'text-neutral-950 dark:text-white'
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
