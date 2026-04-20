# Architecture Notes

This project is a Vite + React cryptocurrency dashboard using the CoinGecko public API. The implementation is organized around small UI components, focused hooks, and a thin API layer so the code is easy to explain in an interview.

## Folder Structure

```text
src/
  api/            CoinGecko API wrappers
  components/     Reusable dashboard, table, profile, and product UI
  data/           Local fallback market data
  hooks/          Data fetching, persistence, theme, and recent-view state
  utils/          Formatting helpers
```

## Data Flow

`src/api/coinGecko.js` contains the raw API calls:

- `fetchMarkets()` for the top market-cap assets.
- `fetchCoinDetails()` for the selected coin profile.
- `fetchMarketChart()` for chart ranges in the coin profile.

`src/hooks/useCryptoMarkets.js` owns the market list lifecycle:

- Initial loading state.
- Manual refresh.
- 60-second polling.
- Updated-price highlight detection.
- Live, cached, and demo data modes.
- `localStorage` caching for the last successful market response.

The main app composes that state into presentational components such as `MarketSummary`, `AssetTable`, `AssetCards`, and `AssetDrawer`.

## API Resilience

CoinGecko's public API can rate-limit or temporarily fail, so the app avoids blank screens:

1. Try live CoinGecko data.
2. If that fails and cached data exists, show the latest cached snapshot.
3. If no cache exists, show local demo market data.

The header displays the current source mode:

- `Live API`
- `Cached`
- `Demo`

This makes price differences explainable during review.

## State Management

The app uses React state and custom hooks instead of a global state library because the state is local and understandable:

- `useTheme()` persists dark/light mode.
- `useWatchlist()` persists watchlisted coins.
- `useRecentlyViewed()` persists opened coin profiles.
- `useLocalStorageState()` powers portfolio holdings, price alerts, compare selections, and table column preferences.

This keeps the dependency footprint small while still demonstrating practical state management.

## Performance

The dashboard uses:

- `useMemo` for search, tab filtering, watchlist filtering, and sorting.
- `React.memo` for desktop table rows.
- Client-side filtering over a bounded 50-asset dataset.
- Dedicated mobile cards instead of forcing a wide table into small screens.

## UI Structure

The dashboard is organized into four high-level views:

- `Market`: main table, search, tabs, column controls, summary, watchlist, and movers.
- `Portfolio`: holdings simulator, watchlist, alerts, and recently viewed assets.
- `Tools`: comparison, alerts, market pulse, and table customization.
- `Insights`: sentiment, movers, market pulse, and comparison.

Clicking a coin opens a full profile view with chart ranges, stats, links, description, markets, community data, and related trends.

## Known Limitations

- Public CoinGecko API responses can differ slightly from the CoinGecko website due to refresh timing.
- Some panels, such as NFT and exchange snapshots, are product-style static summaries rather than live exchange/NFT API integrations.
- Portfolio and alerts are local browser simulations, not account-backed financial tools.
