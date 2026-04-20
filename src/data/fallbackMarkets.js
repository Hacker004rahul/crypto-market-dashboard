function makeLogo(symbol, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${color}"/><text x="40" y="49" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="white">${symbol.slice(0, 2).toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeSparkline(start, drift) {
  return Array.from({ length: 168 }, (_, index) => {
    const wave = Math.sin(index / 8) * start * 0.018;
    const smallerWave = Math.cos(index / 17) * start * 0.012;
    const trend = index * drift;
    return Math.max(start + wave + smallerWave + trend, 0.000001);
  });
}

const baseAssets = [
  ['bitcoin', 'Bitcoin', 'btc', 87321, 0.42, 1.24, 6.8, 1712000000000, 42600000000, 1, '#f7931a'],
  ['ethereum', 'Ethereum', 'eth', 2316, 0.18, -0.35, 4.2, 279800000000, 17200000000, 2, '#627eea'],
  ['tether', 'Tether', 'usdt', 1, 0.01, 0.02, 0.03, 187200000000, 72000000000, 3, '#26a17b'],
  ['xrp', 'XRP', 'xrp', 1.42, -0.14, 0.52, 7.5, 80700000000, 2970000000, 4, '#23292f'],
  ['binancecoin', 'BNB', 'bnb', 627.74, 0.28, 1.2, 5.1, 84600000000, 1010000000, 5, '#f3ba2f'],
  ['usd-coin', 'USDC', 'usdc', 0.999, 0.01, -0.01, 0.01, 78200000000, 15300000000, 6, '#2775ca'],
  ['solana', 'Solana', 'sol', 85.12, 0.08, -0.37, 3.9, 48900000000, 4550000000, 7, '#14f195'],
  ['tron', 'TRON', 'trx', 0.309, 0.32, 0.81, 2.8, 31300000000, 1020000000, 8, '#eb0029'],
  ['dogecoin', 'Dogecoin', 'doge', 0.211, -0.21, 2.45, 11.4, 30700000000, 1930000000, 9, '#c2a633'],
  ['cardano', 'Cardano', 'ada', 0.63, 0.12, -1.12, 1.9, 22500000000, 820000000, 10, '#0033ad'],
  ['staked-ether', 'Lido Staked Ether', 'steth', 2309, 0.19, -0.31, 4.1, 21100000000, 51000000, 11, '#00a3ff'],
  ['chainlink', 'Chainlink', 'link', 18.24, 0.44, 2.1, 8.2, 11800000000, 681000000, 12, '#375bd2'],
  ['avalanche-2', 'Avalanche', 'avax', 31.18, -0.18, 1.08, 6.4, 12600000000, 502000000, 13, '#e84142'],
  ['sui', 'Sui', 'sui', 3.76, 0.71, 3.62, 14.7, 12100000000, 998000000, 14, '#6fbcf0'],
  ['the-open-network', 'Toncoin', 'ton', 3.18, 0.05, -1.41, -2.8, 8110000000, 344000000, 15, '#0098ea'],
];

export const fallbackMarkets = baseAssets.map(
  ([id, name, symbol, price, oneHour, day, week, marketCap, volume, rank, color]) => {
    const drift = (price * week) / 100 / 168;
    const sparkline = makeSparkline(price * (1 - week / 100), drift);

    return {
      id,
      symbol,
      name,
      image: makeLogo(symbol, color),
      current_price: price,
      market_cap: marketCap,
      market_cap_rank: rank,
      fully_diluted_valuation: marketCap * 1.08,
      total_volume: volume,
      high_24h: price * 1.035,
      low_24h: price * 0.965,
      price_change_24h: (price * day) / 100,
      price_change_percentage_24h: day,
      price_change_percentage_1h_in_currency: oneHour,
      price_change_percentage_7d_in_currency: week,
      market_cap_change_24h: (marketCap * day) / 100,
      market_cap_change_percentage_24h: day,
      circulating_supply: marketCap / price,
      total_supply: (marketCap / price) * 1.12,
      max_supply: null,
      ath: price * 1.85,
      ath_change_percentage: -46,
      atl: price * 0.12,
      atl_change_percentage: 730,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: {
        price: sparkline,
      },
    };
  },
);
