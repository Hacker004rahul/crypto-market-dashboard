const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const COIN_URL = 'https://api.coingecko.com/api/v3/coins';

export async function fetchMarkets({ signal } = {}) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '50',
    page: '1',
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d',
    locale: 'en',
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with ${response.status}`);
  }

  return response.json();
}

export async function fetchCoinDetails(coinId, { signal } = {}) {
  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'true',
    market_data: 'true',
    community_data: 'true',
    developer_data: 'true',
    sparkline: 'true',
  });

  const response = await fetch(`${COIN_URL}/${coinId}?${params.toString()}`, {
    headers: {
      accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`CoinGecko coin request failed with ${response.status}`);
  }

  return response.json();
}

export async function fetchMarketChart(coinId, days = 7, { signal } = {}) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: String(days),
  });

  const response = await fetch(`${COIN_URL}/${coinId}/market_chart?${params.toString()}`, {
    headers: {
      accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`CoinGecko chart request failed with ${response.status}`);
  }

  return response.json();
}
