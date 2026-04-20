import { useState } from 'react';
import { ChangeBadge } from './ChangeBadge';
import { PriceChart } from './PriceChart';
import { Sparkline } from './Sparkline';
import { useCoinDetails } from '../hooks/useCoinDetails';
import { useMarketChart } from '../hooks/useMarketChart';
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

function stripHtml(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function StatRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 py-3 text-sm last:border-0 dark:border-neutral-800">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span
        className={`text-right font-bold ${
          tone === 'up'
            ? 'text-emerald-700 dark:text-emerald-300'
            : tone === 'down'
              ? 'text-red-600 dark:text-red-300'
              : 'text-neutral-950 dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function LinkPill({ href, children }) {
  if (!href) {
    return null;
  }

  return (
    <a
      className="rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-white"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function MiniMarketTable({ tickers = [], fallbackAsset }) {
  const rows = tickers.slice(0, 8);

  if (rows.length === 0) {
    rows.push({
      market: { name: 'CoinGecko Composite' },
      base: fallbackAsset.symbol.toUpperCase(),
      target: 'USD',
      last: fallbackAsset.current_price,
      volume: fallbackAsset.total_volume,
      trust_score: fallbackAsset.price_change_percentage_24h >= 0 ? 'green' : 'red',
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead className="bg-stone-100 text-left text-xs uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          <tr>
            <th className="px-3 py-3">Exchange</th>
            <th className="px-3 py-3">Pair</th>
            <th className="px-3 py-3 text-right">Price</th>
            <th className="px-3 py-3 text-right">Volume</th>
            <th className="px-3 py-3 text-right">Trust</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((ticker, index) => (
            <tr className="border-b border-stone-100 dark:border-neutral-800" key={`${ticker.market?.name}-${index}`}>
              <td className="px-3 py-3 font-semibold text-neutral-950 dark:text-white">
                {ticker.market?.name ?? 'Market'}
              </td>
              <td className="px-3 py-3 text-neutral-600 dark:text-neutral-300">
                {ticker.base}/{ticker.target}
              </td>
              <td className="px-3 py-3 text-right font-bold text-neutral-950 dark:text-white">
                {formatCurrency(ticker.last)}
              </td>
              <td className="px-3 py-3 text-right text-neutral-600 dark:text-neutral-300">
                {formatCompactCurrency(ticker.converted_volume?.usd ?? ticker.volume ?? 0)}
              </td>
              <td className="px-3 py-3 text-right">
                <span
                  className={`rounded-md px-2 py-1 text-xs font-bold ${
                    ticker.trust_score === 'green'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200'
                  }`}
                >
                  {ticker.trust_score ?? 'tracked'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AssetDrawer({ asset, assets = [], onClose }) {
  const { details, status, error } = useCoinDetails(asset?.id);
  const [range, setRange] = useState({ label: '7D', days: 7 });
  const { prices: rangedPrices, status: chartStatus } = useMarketChart(asset?.id, range.days);

  if (!asset) {
    return null;
  }

  const marketData = details?.market_data;
  const description = stripHtml(details?.description?.en);
  const chartPrices =
    rangedPrices.length > 0 ? rangedPrices : marketData?.sparkline_7d?.price ?? asset.sparkline_in_7d?.price ?? [];
  const homepage = details?.links?.homepage?.find(Boolean);
  const blockchainSite = details?.links?.blockchain_site?.find(Boolean);
  const subreddit = details?.links?.subreddit_url;
  const officialForum = details?.links?.official_forum_url?.find(Boolean);
  const github = details?.links?.repos_url?.github?.find(Boolean);
  const categories = details?.categories?.filter(Boolean).slice(0, 4) ?? ['Cryptocurrency'];
  const relatedAssets = assets
    .filter((candidate) => candidate.id !== asset.id)
    .slice(0, 6);
  const positive = (asset.price_change_percentage_7d_in_currency ?? asset.price_change_percentage_24h ?? 0) >= 0;

  const sidebarStats = [
    { label: 'Market cap rank', value: `#${asset.market_cap_rank}` },
    { label: 'Market cap', value: formatCompactCurrency(asset.market_cap) },
    { label: '24h volume', value: formatCompactCurrency(asset.total_volume) },
    { label: '24h low / high', value: `${formatCurrency(asset.low_24h)} / ${formatCurrency(asset.high_24h)}` },
    { label: 'Circulating supply', value: `${formatNumber(asset.circulating_supply)} ${asset.symbol.toUpperCase()}` },
    { label: 'All-time high', value: formatCurrency(asset.ath) },
  ];

  const performanceStats = [
    { label: '1h', value: formatPercent(asset.price_change_percentage_1h_in_currency ?? 0), raw: asset.price_change_percentage_1h_in_currency ?? 0 },
    { label: '24h', value: formatPercent(asset.price_change_percentage_24h ?? 0), raw: asset.price_change_percentage_24h ?? 0 },
    { label: '7d', value: formatPercent(asset.price_change_percentage_7d_in_currency ?? 0), raw: asset.price_change_percentage_7d_in_currency ?? 0 },
    { label: 'ATH change', value: formatPercent(asset.ath_change_percentage ?? 0), raw: asset.ath_change_percentage ?? 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f2] text-neutral-950 dark:bg-[#121212] dark:text-white">
      <div className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-stone-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
            onClick={onClose}
            type="button"
          >
            Back to markets
          </button>
          <div className="hidden items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 sm:flex">
            <span>Coins</span>
            <span>/</span>
            <span className="text-neutral-950 dark:text-white">{asset.name}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4">
          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <img alt="" className="h-12 w-12 rounded-full" src={asset.image} />
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black">{asset.name}</h1>
                <p className="text-sm font-bold uppercase text-neutral-500 dark:text-neutral-400">{asset.symbol}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{asset.name} Price</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-3xl font-black">{formatCurrency(asset.current_price)}</p>
                <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
              </div>
            </div>
            <div className="mt-4">
              {sidebarStats.map((stat) => (
                <StatRow key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-black">{asset.name} Info</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkPill href={homepage}>Website</LinkPill>
              <LinkPill href={blockchainSite}>Explorer</LinkPill>
              <LinkPill href={github}>Source code</LinkPill>
              <LinkPill href={subreddit}>Community</LinkPill>
              <LinkPill href={officialForum}>Forum</LinkPill>
            </div>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-black">Categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  className="rounded-md bg-stone-100 px-3 py-2 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  key={category}
                >
                  {category}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <div className="space-y-5">
          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col justify-between gap-3 border-b border-stone-100 pb-4 dark:border-neutral-800 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                  Live profile
                </p>
                <h2 className="mt-1 text-2xl font-black">{asset.name} Price Chart</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '1D', days: 1 },
                  { label: '7D', days: 7 },
                  { label: '1M', days: 30 },
                  { label: '1Y', days: 365 },
                  { label: 'MAX', days: 'max' },
                ].map((option) => (
                  <button
                    className={`rounded-md px-3 py-2 text-sm font-bold ${
                      range.label === option.label
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
                        : 'bg-stone-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                    key={option.label}
                    onClick={() => setRange(option)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {chartStatus === 'loading' && (
              <p className="pt-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">Loading chart range...</p>
            )}
            {chartStatus === 'error' && (
              <p className="pt-3 text-sm font-semibold text-amber-700 dark:text-amber-200">
                Live range chart is unavailable. Showing the latest 7 day series.
              </p>
            )}
            <div className="pt-4">
              <PriceChart positive={positive} prices={chartPrices} />
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {performanceStats.map((stat) => (
              <div
                className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                key={stat.label}
              >
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label} performance</p>
                <p
                  className={`mt-2 text-2xl font-black ${
                    stat.raw >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-md border border-stone-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-xl font-black">What is {asset.name}?</h2>
              {status === 'loading' && (
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-neutral-800" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-stone-100 dark:bg-neutral-800" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-stone-100 dark:bg-neutral-800" />
                </div>
              )}
              {error && <p className="mt-4 text-sm font-semibold text-amber-700 dark:text-amber-200">{error}</p>}
              <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                {description ||
                  `${asset.name} is tracked from CoinGecko market data with live price, supply, trading volume, and performance metrics. This profile updates from the selected market row and expands into deeper context when extended coin data is available.`}
              </p>
            </article>

            <aside className="rounded-md border border-stone-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-xl font-black">Community</h2>
              <div className="mt-4 space-y-3">
                <StatRow label="Sentiment up" value={`${formatNumber(details?.sentiment_votes_up_percentage ?? 0)}%`} tone="up" />
                <StatRow label="Sentiment down" value={`${formatNumber(details?.sentiment_votes_down_percentage ?? 0)}%`} tone="down" />
                <StatRow label="Watchlist users" value={formatNumber(details?.watchlist_portfolio_users ?? 0)} />
                <StatRow label="Genesis date" value={details?.genesis_date ?? 'Not listed'} />
              </div>
            </aside>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-xl font-black">{asset.name} Markets</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Top exchange pairs from CoinGecko tickers.
            </p>
            <div className="mt-4">
              <MiniMarketTable fallbackAsset={asset} tickers={details?.tickers ?? []} />
            </div>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-xl font-black">Related Market Trends</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {relatedAssets.map((related) => (
                <div className="rounded-md border border-stone-200 p-3 dark:border-neutral-800" key={related.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <img alt="" className="h-8 w-8 rounded-full" src={related.image} />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{related.name}</p>
                        <p className="text-xs uppercase text-neutral-500 dark:text-neutral-400">{related.symbol}</p>
                      </div>
                    </div>
                    <ChangeBadge value={related.price_change_percentage_24h ?? 0} />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Sparkline
                      positive={(related.price_change_percentage_7d_in_currency ?? 0) >= 0}
                      prices={related.sparkline_in_7d?.price}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
