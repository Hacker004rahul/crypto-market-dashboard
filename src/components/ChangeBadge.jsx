import { formatPercent } from '../utils/formatters';

export function ChangeBadge({ value }) {
  const positive = value >= 0;

  return (
    <span
      className={`inline-flex min-w-20 justify-center rounded-md px-2.5 py-1 text-sm font-bold ${
        positive
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
          : 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-300'
      }`}
    >
      {formatPercent(value)}
    </span>
  );
}
