const columns = [
  { key: 'oneHour', label: '1h' },
  { key: 'sevenDay', label: '7d' },
  { key: 'volume', label: 'Volume' },
  { key: 'marketCap', label: 'Market cap' },
  { key: 'sparkline', label: 'Sparkline' },
];

export function ColumnCustomizer({ visibleColumns, onVisibleColumnsChange }) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black">Table Columns</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Choose which desktop columns stay visible.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {columns.map((column) => (
            <button
              className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                visibleColumns[column.key]
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
                  : 'border-stone-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'
              }`}
              key={column.key}
              onClick={() =>
                onVisibleColumnsChange((current) => ({
                  ...current,
                  [column.key]: !current[column.key],
                }))
              }
              type="button"
            >
              {column.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
