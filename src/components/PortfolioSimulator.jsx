import { formatCompactCurrency, formatCurrency } from '../utils/formatters';

export function PortfolioSimulator({ assets, holdings, onHoldingsChange }) {
  const rows = assets.slice(0, 8);
  const positions = rows
    .map((asset) => {
      const amount = Number(holdings[asset.id] ?? 0);
      const value = amount * (asset.current_price ?? 0);
      const dayChange = value * ((asset.price_change_percentage_24h ?? 0) / 100);
      return { asset, amount, value, dayChange };
    })
    .filter((position) => position.amount > 0);
  const totalValue = positions.reduce((sum, position) => sum + position.value, 0);
  const totalDayChange = positions.reduce((sum, position) => sum + position.dayChange, 0);

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h2 className="text-lg font-black">Portfolio Simulator</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add sample holdings and estimate value from current market prices.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <div className="rounded-md bg-stone-100 px-3 py-2 dark:bg-neutral-800">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Portfolio value</p>
            <p className="font-black">{formatCompactCurrency(totalValue)}</p>
          </div>
          <div className="rounded-md bg-stone-100 px-3 py-2 dark:bg-neutral-800">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">24h P/L</p>
            <p className={`font-black ${totalDayChange >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
              {formatCurrency(totalDayChange)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((asset) => (
          <label className="rounded-md border border-stone-200 p-3 dark:border-neutral-800" key={asset.id}>
            <span className="flex items-center gap-2 text-sm font-bold">
              <img alt="" className="h-6 w-6 rounded-full" src={asset.image} />
              {asset.symbol.toUpperCase()}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-stone-300 bg-[#fbfbf8] px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-950"
              min="0"
              onChange={(event) =>
                onHoldingsChange((current) => ({
                  ...current,
                  [asset.id]: event.target.value,
                }))
              }
              placeholder="0.00"
              step="any"
              type="number"
              value={holdings[asset.id] ?? ''}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
