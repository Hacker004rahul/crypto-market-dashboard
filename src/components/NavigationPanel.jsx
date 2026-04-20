import { formatCompactCurrency } from '../utils/formatters';

function PanelShell({ title, eyebrow, children }) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black text-neutral-950 dark:text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ExchangesPanel({ assets }) {
  const totalVolume = assets.reduce((sum, asset) => sum + (asset.total_volume ?? 0), 0);
  const exchanges = [
    { name: 'Binance', country: 'Global', share: 0.32, trust: 'High' },
    { name: 'Coinbase Exchange', country: 'United States', share: 0.18, trust: 'High' },
    { name: 'OKX', country: 'Seychelles', share: 0.15, trust: 'High' },
    { name: 'Bybit', country: 'Global', share: 0.12, trust: 'High' },
    { name: 'Kraken', country: 'United States', share: 0.09, trust: 'High' },
  ];

  return (
    <PanelShell eyebrow="Exchange activity" title="Top Exchanges By Tracked Volume">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-stone-100 text-left text-xs uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-3">Exchange</th>
              <th className="px-3 py-3">Region</th>
              <th className="px-3 py-3 text-right">Estimated 24h Volume</th>
              <th className="px-3 py-3 text-right">Trust</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange) => (
              <tr className="border-b border-stone-100 dark:border-neutral-800" key={exchange.name}>
                <td className="px-3 py-3 font-bold text-neutral-950 dark:text-white">{exchange.name}</td>
                <td className="px-3 py-3 text-neutral-600 dark:text-neutral-300">{exchange.country}</td>
                <td className="px-3 py-3 text-right font-bold">
                  {formatCompactCurrency(totalVolume * exchange.share)}
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
                    {exchange.trust}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}

function NftPanel() {
  const collections = [
    { name: 'CryptoPunks', floor: '42.5 ETH', change: '+2.4%', chain: 'Ethereum' },
    { name: 'Bored Ape Yacht Club', floor: '9.8 ETH', change: '-1.1%', chain: 'Ethereum' },
    { name: 'Pudgy Penguins', floor: '12.3 ETH', change: '+4.8%', chain: 'Ethereum' },
    { name: 'Mad Lads', floor: '98 SOL', change: '+1.7%', chain: 'Solana' },
  ];

  return (
    <PanelShell eyebrow="NFT watch" title="NFT Collections Snapshot">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {collections.map((collection) => (
          <article className="rounded-md border border-stone-200 p-4 dark:border-neutral-800" key={collection.name}>
            <p className="font-black text-neutral-950 dark:text-white">{collection.name}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{collection.chain}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Floor</p>
                <p className="mt-1 text-xl font-black">{collection.floor}</p>
              </div>
              <span
                className={`rounded-md px-2 py-1 text-sm font-bold ${
                  collection.change.startsWith('+')
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200'
                }`}
              >
                {collection.change}
              </span>
            </div>
          </article>
        ))}
      </div>
    </PanelShell>
  );
}

function LearnPanel() {
  const lessons = [
    ['Market Cap', 'Why market cap matters more than token price.'],
    ['24h Change', 'How short-term momentum is calculated and interpreted.'],
    ['Volume', 'How trading volume can confirm or weaken a price move.'],
    ['Circulating Supply', 'How supply affects valuation and scarcity.'],
  ];

  return (
    <PanelShell eyebrow="Learn crypto" title="Quick Concepts For Reading This Dashboard">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lessons.map(([title, copy]) => (
          <article className="rounded-md border border-stone-200 p-4 dark:border-neutral-800" key={title}>
            <h3 className="font-black text-neutral-950 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{copy}</p>
          </article>
        ))}
      </div>
    </PanelShell>
  );
}

function ProductsPanel({ onJumpToTools }) {
  const products = [
    ['Portfolio Simulator', 'Model holdings and 24h P/L.'],
    ['Price Alerts', 'Track local target prices.'],
    ['Compare Coins', 'Inspect assets side by side.'],
    ['Market Pulse', 'Scan market-cap weighted movement.'],
  ];

  return (
    <PanelShell eyebrow="Dashboard tools" title="Product Toolkit">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {products.map(([title, copy]) => (
          <button
            className="rounded-md border border-stone-200 p-4 text-left transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            key={title}
            onClick={onJumpToTools}
            type="button"
          >
            <h3 className="font-black text-neutral-950 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{copy}</p>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

export function NavigationPanel({ activeNav, assets, onJumpToTools }) {
  if (activeNav === 'Cryptocurrencies') {
    return null;
  }

  if (activeNav === 'Exchanges') {
    return <ExchangesPanel assets={assets} />;
  }

  if (activeNav === 'NFT') {
    return <NftPanel />;
  }

  if (activeNav === 'Learn') {
    return <LearnPanel />;
  }

  if (activeNav === 'Products') {
    return <ProductsPanel onJumpToTools={onJumpToTools} />;
  }

  return null;
}
