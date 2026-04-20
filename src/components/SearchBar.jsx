const sortOptions = [
  { label: 'Market cap', value: 'marketCap' },
  { label: 'Price', value: 'price' },
  { label: '24h change', value: 'change' },
  { label: 'Volume', value: 'volume' },
  { label: 'Name', value: 'name' },
];

export function SearchBar({
  query,
  onQueryChange,
  resultCount,
  sortKey,
  onSortChange,
  watchlistOnly,
  onWatchlistOnlyChange,
  watchlistCount,
}) {
  return (
    <div className="grid gap-3 rounded-md border border-stone-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-end">
      <label className="w-full md:max-w-md">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
          Search
        </span>
        <input
          className="mt-2 w-full rounded-md border border-stone-300 bg-[#fbfbf8] px-3 py-2.5 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-emerald-400"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Bitcoin, ETH, sol..."
          type="search"
          value={query}
        />
      </label>

      <label>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
          Sort by
        </span>
        <select
          className="mt-2 w-full rounded-md border border-stone-300 bg-[#fbfbf8] px-3 py-2.5 text-neutral-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-emerald-400 lg:w-44"
          onChange={(event) => onSortChange(event.target.value)}
          value={sortKey}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className={`rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
          watchlistOnly
            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-400/15 dark:text-emerald-200'
            : 'border-stone-300 bg-white text-neutral-800 hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-500'
        }`}
        onClick={onWatchlistOnlyChange}
        type="button"
      >
        Watchlist {watchlistCount}
      </button>

      <div className="rounded-md bg-stone-100 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        {resultCount} results
      </div>
    </div>
  );
}
