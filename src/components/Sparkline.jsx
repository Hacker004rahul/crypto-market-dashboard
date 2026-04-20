export function Sparkline({ prices = [], positive = true }) {
  const values = prices.filter((price) => Number.isFinite(price));

  if (values.length < 2) {
    return <div className="h-10 w-32 rounded bg-stone-100 dark:bg-neutral-800" />;
  }

  const width = 128;
  const height = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((price, index) => {
      const x = index * step;
      const y = height - ((price - min) / range) * (height - 5) - 2.5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg aria-hidden="true" className="h-10 w-32" role="img" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        points={points}
        stroke={positive ? '#16a34a' : '#dc2626'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}
