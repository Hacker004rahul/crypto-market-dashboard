export const formatCurrency = (value, options = {}) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1 ? 2 : 6,
    ...options,
  }).format(value ?? 0);

export const formatCompactCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const formatPercent = (value) =>
  `${value >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value ?? 0)}%`;

export const formatTime = (date) =>
  date
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date)
    : 'Waiting for first sync';
