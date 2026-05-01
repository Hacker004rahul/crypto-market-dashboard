import { formatCompactCurrency, formatPercent, formatTime } from '../utils/formatters';

const dataModeLabels = {
  live: 'Live API',
  cached: 'Cached',
  demo: 'Demo',
  loading: 'Loading',
};

const navItems = ['Cryptocurrencies', 'Exchanges', 'NFT', 'Products'];

export function Header({
  assets = [],
  lastUpdated,
  isRefreshing,
  theme,
  onToggleTheme,
  onRefresh,
  dataMode,
  activeNav,
  onNavChange,
}) {
   const totalMarketCap = assets.reduce((sum, asset) => sum + (asset.market_cap ?? 0), 0);
  const totalVolume = assets.reduce((sum, asset) => sum + (asset.total_volume ?? 0), 0);
  const bitcoin = assets.find((asset) => asset.id === 'bitcoin');
  const ethereum = assets.find((asset) => asset.id === 'ethereum');
  const bitcoinDominance = totalMarketCap > 0 ? ((bitcoin?.market_cap ?? 0) / totalMarketCap) * 100 : 0;
  const ethereumDominance = totalMarketCap > 0 ? ((ethereum?.market_cap ?? 0) / totalMarketCap) * 100 : 0;
  const sourceLabel = dataModeLabels[dataMode] ?? 'Checking';

 
  return (

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden bg-transparent sm:h-24 sm:w-40">
            <img
              alt="Crypto Market Dashboard logo"
              className="h-full w-full object-contain dark:hidden"
              src="/crypto-market-logo-transparent.png"
            />
            <img
              alt="Crypto Market Dashboard logo"
              className="hidden h-full w-full object-contain dark:block"
              src="/crypto-market-logo-dark.png"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-neutral-950 dark:text-white sm:text-2xl">Crypto Market Dashboard</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Cryptocurrencies, watchlists, and live ranks</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {navItems.map((item) => (
            <button
              className={`rounded-md px-3 py-2 transition ${
                activeNav === item
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
                  : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white'
              }`}
              key={item}
              onClick={() => onNavChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
              <span
                className={`h-2 w-2 rounded-full ${
                  isRefreshing
                    ? 'animate-pulse bg-amber-500'
                    : dataMode === 'live'
                      ? 'bg-emerald-500'
                      : dataMode === 'cached'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                }`}
              />
              {isRefreshing ? 'Refreshing' : dataModeLabels[dataMode] ?? 'Checking'}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:border-neutral-500 hover:bg-stone-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
              onClick={onRefresh}
              type="button"
            >
              Refresh
            </button>
            <button
              className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              onClick={onToggleTheme}
              type="button"
            >
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
