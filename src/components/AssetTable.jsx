import { memo } from 'react';
import { ChangeBadge } from './ChangeBadge';
import { Sparkline } from './Sparkline';
import { StarIcon } from './StarIcon';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters';

function AssetRowComponent({ asset, rank, onSelect, isFlashing, isWatched, onToggleWatchlist, visibleColumns }) {
  return (
    <tr
      className="cursor-pointer border-b border-stone-100 text-sm transition hover:bg-stone-50 dark:border-neutral-800 dark:hover:bg-neutral-800/70"
      onClick={() => onSelect(asset)}
    >
      <td className="px-3 py-3 text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-3">
          <button
            aria-label={`${isWatched ? 'Remove' : 'Add'} ${asset.name} ${isWatched ? 'from' : 'to'} watchlist`}
            className={`h-7 w-7 rounded-md border text-base font-bold leading-none transition ${
              isWatched
                ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-300 dark:bg-amber-300/15 dark:text-amber-200'
                : 'border-stone-300 text-neutral-400 hover:border-amber-400 hover:text-amber-600 dark:border-neutral-700 dark:hover:border-amber-300 dark:hover:text-amber-200'
            }`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleWatchlist(asset.id);
            }}
            type="button"
          >
            <span className="flex items-center justify-center">
              <StarIcon filled={isWatched} />
            </span>
          </button>
          {rank}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <img alt="" className="h-8 w-8 rounded-full" src={asset.image} />
          <div>
            <p className="font-semibold text-neutral-950 dark:text-white">{asset.name}</p>
            <p className="text-sm uppercase text-neutral-500 dark:text-neutral-400">{asset.symbol}</p>
          </div>
        </div>
      </td>
      <td
        className={`px-3 py-3 text-right font-semibold text-neutral-950 transition dark:text-white ${
          isFlashing ? 'bg-amber-100 dark:bg-amber-400/15' : ''
        }`}
      >
        {formatCurrency(asset.current_price)}
      </td>
      {visibleColumns.oneHour && (
        <td className="px-3 py-3 text-right">
          <ChangeBadge value={asset.price_change_percentage_1h_in_currency ?? 0} />
        </td>
      )}
      <td className="px-3 py-3 text-right">
        <ChangeBadge value={asset.price_change_percentage_24h ?? 0} />
      </td>
      {visibleColumns.sevenDay && (
        <td className="px-3 py-3 text-right">
          <ChangeBadge value={asset.price_change_percentage_7d_in_currency ?? 0} />
        </td>
      )}
      {visibleColumns.marketCap && (
        <td className="px-3 py-3 text-right text-neutral-700 dark:text-neutral-200">
          {formatCompactCurrency(asset.market_cap)}
        </td>
      )}
      {visibleColumns.volume && (
        <td className="px-3 py-3 text-right text-neutral-700 dark:text-neutral-200">
          {formatCompactCurrency(asset.total_volume)}
        </td>
      )}
      {visibleColumns.sparkline && (
        <td className="px-3 py-3">
          <Sparkline
            positive={(asset.price_change_percentage_7d_in_currency ?? asset.price_change_percentage_24h ?? 0) >= 0}
            prices={asset.sparkline_in_7d?.price}
          />
        </td>
      )}
    </tr>
  );
}

const AssetRow = memo(AssetRowComponent);

function SortHeader({ label, sortValue, sortKey, onSortChange, align = 'left' }) {
  const active = sortKey === sortValue;

  return (
    <th className={`px-3 py-3 font-bold ${align === 'right' ? 'text-right' : ''}`}>
      <button
        className={`rounded-md px-2 py-1 transition hover:bg-white dark:hover:bg-neutral-900 ${
          active ? 'text-neutral-950 dark:text-white' : ''
        }`}
        onClick={() => onSortChange(sortValue)}
        type="button"
      >
        {label} {active ? 'v' : ''}
      </button>
    </th>
  );
}

export function AssetTable({
  assets,
  onSelect,
  flashIds,
  sortKey,
  onSortChange,
  watchlistSet,
  onToggleWatchlist,
  visibleColumns,
}) {
  return (
    <div className="hidden overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:block">
      <table className="w-full border-collapse">
        <thead className="bg-stone-100 text-left text-xs uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          <tr>
            <th className="px-3 py-3 font-bold">Watch</th>
            <SortHeader label="Asset" onSortChange={onSortChange} sortKey={sortKey} sortValue="name" />
            <SortHeader align="right" label="Price" onSortChange={onSortChange} sortKey={sortKey} sortValue="price" />
            {visibleColumns.oneHour && <th className="px-3 py-3 text-right font-bold">1h</th>}
            <SortHeader align="right" label="24h" onSortChange={onSortChange} sortKey={sortKey} sortValue="change" />
            {visibleColumns.sevenDay && <th className="px-3 py-3 text-right font-bold">7d</th>}
            {visibleColumns.marketCap && (
              <SortHeader
                align="right"
                label="Market cap"
                onSortChange={onSortChange}
                sortKey={sortKey}
                sortValue="marketCap"
              />
            )}
            {visibleColumns.volume && (
              <SortHeader
                align="right"
                label="Volume"
                onSortChange={onSortChange}
                sortKey={sortKey}
                sortValue="volume"
              />
            )}
            {visibleColumns.sparkline && <th className="px-3 py-3 font-bold">Last 7 days</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <AssetRow
              asset={asset}
              isFlashing={flashIds.has(asset.id)}
              isWatched={watchlistSet.has(asset.id)}
              key={asset.id}
              onSelect={onSelect}
              onToggleWatchlist={onToggleWatchlist}
              rank={asset.market_cap_rank ?? index + 1}
              visibleColumns={visibleColumns}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
