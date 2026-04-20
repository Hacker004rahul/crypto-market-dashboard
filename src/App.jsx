import { useMemo, useState } from 'react';
import { AssetCards } from './components/AssetCards';
import { AssetDrawer } from './components/AssetDrawer';
import { AssetTable } from './components/AssetTable';
import { ColumnCustomizer } from './components/ColumnCustomizer';
import { CompareCoins } from './components/CompareCoins';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { MarketHeatmap } from './components/MarketHeatmap';
import { MarketSummary } from './components/MarketSummary';
import { MarketMovers } from './components/MarketMovers';
import { MarketSentiment } from './components/MarketSentiment';
import { MarketTabs } from './components/MarketTabs';
import { NavigationPanel } from './components/NavigationPanel';
import { PortfolioSimulator } from './components/PortfolioSimulator';
import { PriceAlerts } from './components/PriceAlerts';
import { RecentlyViewed } from './components/RecentlyViewed';
import { SearchBar } from './components/SearchBar';
import { ViewSwitcher } from './components/ViewSwitcher';
import { useCryptoMarkets } from './hooks/useCryptoMarkets';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';
import { useTheme } from './hooks/useTheme';
import { useWatchlist } from './hooks/useWatchlist';
import { WatchlistStrip } from './components/WatchlistStrip';

const sorters = {
  marketCap: (first, second) => (second.market_cap ?? 0) - (first.market_cap ?? 0),
  price: (first, second) => (second.current_price ?? 0) - (first.current_price ?? 0),
  change: (first, second) => (second.price_change_percentage_24h ?? 0) - (first.price_change_percentage_24h ?? 0),
  volume: (first, second) => (second.total_volume ?? 0) - (first.total_volume ?? 0),
  name: (first, second) => first.name.localeCompare(second.name),
};

const tabMatchers = {
  all: () => true,
  highlights: (asset) => asset.market_cap_rank <= 10 || Math.abs(asset.price_change_percentage_24h ?? 0) >= 5,
  layer1: (asset) =>
    ['bitcoin', 'ethereum', 'solana', 'cardano', 'avalanche-2', 'sui', 'the-open-network', 'tron'].includes(asset.id),
  defi: (asset) =>
    ['uniswap', 'chainlink', 'aave', 'maker', 'lido-dao', 'curve-dao-token', 'ondo-finance'].includes(asset.id),
  stablecoins: (asset) =>
    ['tether', 'usd-coin', 'dai', 'first-digital-usd', 'ethena-usde', 'usds'].includes(asset.id),
  meme: (asset) => ['dogecoin', 'shiba-inu', 'pepe', 'official-trump', 'bonk', 'floki'].includes(asset.id),
  ai: (asset) =>
    ['bittensor', 'render-token', 'fetch-ai', 'internet-computer', 'near', 'virtual-protocol'].includes(asset.id),
};

function App() {
  const { assets, status, error, lastUpdated, isRefreshing, flashIds, dataMode, refresh } = useCryptoMarkets();
  const { theme, toggleTheme } = useTheme();
  const { watchlistIds, watchlistSet, toggleWatchlist } = useWatchlist();
  const { recentIds, addRecent } = useRecentlyViewed();
  const [holdings, setHoldings] = useLocalStorageState('crypto-dashboard-holdings', {});
  const [alerts, setAlerts] = useLocalStorageState('crypto-dashboard-alerts', {});
  const [compareIds, setCompareIds] = useLocalStorageState('crypto-dashboard-compare', []);
  const [visibleColumns, setVisibleColumns] = useLocalStorageState('crypto-dashboard-visible-columns', {
    oneHour: true,
    sevenDay: true,
    volume: true,
    marketCap: true,
    sparkline: true,
  });
  const [query, setQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [sortKey, setSortKey] = useState('marketCap');
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState('Cryptocurrencies');
  const [activeView, setActiveView] = useState('market');

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const tabbedAssets = assets.filter(tabMatchers[activeTab] ?? tabMatchers.all);
    const searchedAssets = normalizedQuery
      ? tabbedAssets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(normalizedQuery) ||
            asset.symbol.toLowerCase().includes(normalizedQuery),
        )
      : tabbedAssets;

    const scopedAssets = watchlistOnly
      ? searchedAssets.filter((asset) => watchlistSet.has(asset.id))
      : searchedAssets;

    return [...scopedAssets].sort(sorters[sortKey] ?? sorters.marketCap);
  }, [activeTab, assets, query, sortKey, watchlistOnly, watchlistSet]);

  const isLoading = status === 'loading';
  const isEmpty = !isLoading && filteredAssets.length === 0;

  function openAsset(asset) {
    setSelectedAsset(asset);
    addRecent(asset.id);
  }

  function toggleCompare(assetId) {
    setCompareIds((current) => {
      if (current.includes(assetId)) {
        return current.filter((id) => id !== assetId);
      }

      return [...current, assetId].slice(-3);
    });
  }

  function jumpToTools() {
    setActiveView('tools');
    window.setTimeout(() => {
      document.getElementById('dashboard-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-neutral-950 dark:bg-[#121212] dark:text-white">
      <Header
        assets={assets}
        isRefreshing={isRefreshing}
        activeNav={activeNav}
        dataMode={dataMode}
        lastUpdated={lastUpdated}
        onNavChange={setActiveNav}
        onRefresh={refresh}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <NavigationPanel activeNav={activeNav} assets={assets} onJumpToTools={jumpToTools} />
        <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        {assets.length > 0 && <MarketSummary assets={assets} />}

        {activeView === 'market' && (
          <>
            {assets.length > 0 && <MarketSentiment assets={assets} />}
            {assets.length > 0 && <WatchlistStrip assets={assets} onSelect={openAsset} watchlistSet={watchlistSet} />}
            {assets.length > 0 && <RecentlyViewed assets={assets} onSelect={openAsset} recentIds={recentIds} />}
            {assets.length > 0 && <MarketMovers assets={assets} onSelect={openAsset} />}
            {assets.length > 0 && <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />}
            {assets.length > 0 && (
              <ColumnCustomizer onVisibleColumnsChange={setVisibleColumns} visibleColumns={visibleColumns} />
            )}

            <SearchBar
              onQueryChange={setQuery}
              onSortChange={setSortKey}
              onWatchlistOnlyChange={() => setWatchlistOnly((current) => !current)}
              query={query}
              resultCount={filteredAssets.length}
              sortKey={sortKey}
              watchlistCount={watchlistIds.length}
              watchlistOnly={watchlistOnly}
            />
          </>
        )}

        {activeView === 'portfolio' && (
          <>
            {assets.length > 0 && (
              <PortfolioSimulator assets={assets} holdings={holdings} onHoldingsChange={setHoldings} />
            )}
            {assets.length > 0 && <WatchlistStrip assets={assets} onSelect={openAsset} watchlistSet={watchlistSet} />}
            {assets.length > 0 && <PriceAlerts alerts={alerts} assets={assets} onAlertsChange={setAlerts} />}
            {assets.length > 0 && <RecentlyViewed assets={assets} onSelect={openAsset} recentIds={recentIds} />}
          </>
        )}

        {activeView === 'tools' && (
          <div className="space-y-6 scroll-mt-24" id="dashboard-tools">
            {assets.length > 0 && (
              <CompareCoins assets={assets} compareIds={compareIds} onToggleCompare={toggleCompare} />
            )}
            {assets.length > 0 && <PriceAlerts alerts={alerts} assets={assets} onAlertsChange={setAlerts} />}
            {assets.length > 0 && <MarketHeatmap assets={assets} onSelect={openAsset} />}
            {assets.length > 0 && (
              <ColumnCustomizer onVisibleColumnsChange={setVisibleColumns} visibleColumns={visibleColumns} />
            )}
          </div>
        )}

        {activeView === 'insights' && (
          <>
            {assets.length > 0 && <MarketSentiment assets={assets} />}
            {assets.length > 0 && <MarketMovers assets={assets} onSelect={openAsset} />}
            {assets.length > 0 && <MarketHeatmap assets={assets} onSelect={openAsset} />}
            {assets.length > 0 && (
              <CompareCoins assets={assets} compareIds={compareIds} onToggleCompare={toggleCompare} />
            )}
          </>
        )}

        {activeView !== 'market' && (
          <button
            className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-neutral-800 transition hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-500"
            onClick={() => setActiveView('market')}
            type="button"
          >
            Back to market table
          </button>
        )}

        {activeView === 'market' && (
          <>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
                {error}
              </div>
            )}

            {isLoading && <LoadingSkeleton />}

            {!isLoading && !isEmpty && (
              <>
                <AssetTable
                  assets={filteredAssets}
                  flashIds={flashIds}
                  onSelect={openAsset}
                  onSortChange={setSortKey}
                  onToggleWatchlist={toggleWatchlist}
                  sortKey={sortKey}
                  visibleColumns={visibleColumns}
                  watchlistSet={watchlistSet}
                />
                <AssetCards
                  assets={filteredAssets}
                  flashIds={flashIds}
                  onSelect={openAsset}
                  onToggleWatchlist={toggleWatchlist}
                  watchlistSet={watchlistSet}
                />
              </>
            )}

            {isEmpty && (
              <div className="rounded-md border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-950 dark:text-white">No matching assets</h2>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                  Try searching by a token name or ticker symbol, or turn off the watchlist filter.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <AssetDrawer asset={selectedAsset} assets={assets} onClose={() => setSelectedAsset(null)} />
      <Footer />
    </div>
  );
}

export default App;
