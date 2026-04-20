# Crypto Market Dashboard

A production-style React dashboard for tracking cryptocurrency markets with live CoinGecko data, resilient fallbacks, responsive layouts, and several product-focused UX tools.

## Live Features

- Fetches the top 50 cryptocurrencies by market capitalization from CoinGecko.
- Displays name, symbol, logo, current USD price, 24h price change, market cap, and volume.
- Client-side search by asset name or ticker symbol.
- Sort controls for market cap, price, 24h movement, volume, and name.
- 1h, 24h, and 7d movement columns with 7-day sparklines.
- Responsive desktop table and mobile card layouts.
- Market category tabs inspired by production crypto trackers.
- Full coin profile view on row/card click with chart, links, description, markets, community data, and related trends.
- Functional chart range buttons for `1D`, `7D`, `1M`, `1Y`, and `MAX` when CoinGecko chart data is available.

## Product Enhancements

- Dark/light mode saved in `localStorage`.
- Auto-refresh every 60 seconds with live status and updated-price highlights.
- Watchlist saved in `localStorage`.
- Watchlist dashboard strip with quick price cards.
- Portfolio simulator with local holdings and estimated 24h P/L.
- Side-by-side coin comparison for up to 3 assets.
- Local price alert targets with triggered state.
- Recently viewed coins saved in `localStorage`.
- Market sentiment panel based on tracked gainers and average 24h move.
- Compact market pulse strip colored by 24h performance and weighted by market cap.
- Desktop table column customization saved in `localStorage`.
- Functional header navigation for Cryptocurrencies, Exchanges, NFT, Learn, and Products.
- Cached-data and demo-data fallback when CoinGecko is unreachable or rate-limited.

## Assignment Checklist

| Requirement | Status |
| --- | --- |
| Fetch top cryptocurrencies using CoinGecko `coins/markets` | Complete |
| Name, symbol, and logo | Complete |
| Current USD price | Complete |
| 24h price change with green/red styling | Complete |
| Market capitalization | Complete |
| Client-side search/filter | Complete |
| Responsive desktop/tablet/mobile layout | Complete |
| Tailwind CSS styling | Complete |
| Loading and error states | Complete |
| Dark/light mode persistence | Complete |
| 60-second auto-polling | Complete |
| Deep insights drawer/profile | Complete |
| Performance optimization with `useMemo` and `React.memo` | Complete |
| Clear setup documentation | Complete |

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- CoinGecko API V3
- Browser `localStorage` for user preferences and simulated product state

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

This project is ready for Vercel or Netlify.

For Vercel:

1. Push the repository to GitHub.
2. Import the GitHub repository in Vercel.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`

For Netlify:

1. Push the repository to GitHub.
2. Import the GitHub repository in Netlify.
3. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Technical Decisions

The data layer is isolated in `src/api/coinGecko.js`, while `useCryptoMarkets` owns loading, error, polling, refresh, source mode, and price-change highlight state. This keeps UI components mostly presentational and easy to reason about during review.

The dashboard fetches 50 assets instead of the minimum 10 so search, tabs, comparison, and summary metrics feel useful without requiring pagination. Search remains client-side because the fetched list is small enough to filter instantly.

The app uses dedicated desktop and mobile layouts rather than forcing one table layout onto all screens.

Several product features use `localStorage` because they represent personal browser state rather than server data: theme, watchlist, portfolio entries, alerts, recently viewed coins, compare selections, and table column preferences.

## API Notes

CoinGecko public API rate limits can occasionally return temporary errors. The UI avoids blank screens by falling back to cached data or local demo data, and the header clearly labels whether the app is showing `Live API`, `Cached`, or `Demo` data.

Public API prices can differ slightly from CoinGecko's website because refresh timing and aggregation windows are not always identical.

