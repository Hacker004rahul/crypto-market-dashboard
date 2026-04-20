import { formatCompactCurrency, formatPercent } from '../utils/formatters';

export function MarketSentiment({ assets }) {
  if (assets.length === 0) {
    return null;
  }

  const gainers = assets.filter((asset) => (asset.price_change_percentage_24h ?? 0) >= 0).length;
  const averageChange =
    assets.reduce((sum, asset) => sum + (asset.price_change_percentage_24h ?? 0), 0) / assets.length;
  const totalVolume = assets.reduce((sum, asset) => sum + (asset.total_volume ?? 0), 0);
  const bullishScore = Math.round((gainers / assets.length) * 100);
  const mood = bullishScore >= 65 ? 'Bullish' : bullishScore <= 40 ? 'Bearish' : 'Neutral';
  const tone =
    mood === 'Bullish'
      ? 'text-emerald-700 dark:text-emerald-300'
      : mood === 'Bearish'
        ? 'text-red-600 dark:text-red-300'
        : 'text-amber-700 dark:text-amber-200';

  return (
    <section className="grid gap-3 rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:grid-cols-[1.1fr_1fr_1fr_1fr] lg:items-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
          Market sentiment
        </p>
        <h2 className={`mt-1 text-3xl font-black ${tone}`}>{mood}</h2>
      </div>
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Assets green</p>
        <p className="mt-1 text-xl font-black">
          {gainers}/{assets.length} <span className="text-sm text-neutral-500">({bullishScore}%)</span>
        </p>
      </div>
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Average 24h move</p>
        <p className={`mt-1 text-xl font-black ${averageChange >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
          {formatPercent(averageChange)}
        </p>
      </div>
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Tracked volume</p>
        <p className="mt-1 text-xl font-black">{formatCompactCurrency(totalVolume)}</p>
      </div>
    </section>
  );
}
