import { formatCurrency } from '../utils/formatters';

export function PriceAlerts({ assets, alerts, onAlertsChange }) {
  const rows = assets.slice(0, 8);

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-black">Price Alerts</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Set local targets and see which coins have crossed them.
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((asset) => {
          const target = Number(alerts[asset.id] ?? 0);
          const triggered = target > 0 && asset.current_price >= target;

          return (
            <label className="rounded-md border border-stone-200 p-3 dark:border-neutral-800" key={asset.id}>
              <span className="flex items-center justify-between gap-2 text-sm font-bold">
                <span>{asset.symbol.toUpperCase()}</span>
                <span
                  className={`rounded-md px-2 py-1 text-xs ${
                    triggered
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
                      : 'bg-stone-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {triggered ? 'Triggered' : formatCurrency(asset.current_price)}
                </span>
              </span>
              <input
                className="mt-2 w-full rounded-md border border-stone-300 bg-[#fbfbf8] px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-950"
                min="0"
                onChange={(event) =>
                  onAlertsChange((current) => ({
                    ...current,
                    [asset.id]: event.target.value,
                  }))
                }
                placeholder="Target USD"
                step="any"
                type="number"
                value={alerts[asset.id] ?? ''}
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
