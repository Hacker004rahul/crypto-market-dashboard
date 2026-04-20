import { formatCurrency } from '../utils/formatters';

export function PriceChart({ prices = [], positive = true }) {
  const values = prices.filter((price) => Number.isFinite(price));

  if (values.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-stone-300 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        Waiting for chart data
      </div>
    );
  }

  const width = 760;
  const height = 300;
  const padding = 18;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - padding * 2) / (values.length - 1);
  const points = values.map((price, index) => {
    const x = padding + index * step;
    const y = height - padding - ((price - min) / range) * (height - padding * 2);
    return [x, y];
  });
  const line = points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
  const stroke = positive ? '#16a34a' : '#dc2626';
  const fill = positive ? '#dcfce7' : '#fee2e2';

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-neutral-500 dark:text-neutral-400">7 day price range</span>
        <span className="font-bold text-neutral-950 dark:text-white">
          {formatCurrency(min)} - {formatCurrency(max)}
        </span>
      </div>
      <svg className="h-72 w-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <polygon fill={fill} opacity="0.75" points={area} />
        <polyline
          fill="none"
          points={line}
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
