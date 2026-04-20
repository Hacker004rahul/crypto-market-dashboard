import { useEffect, useState } from 'react';
import { fetchMarketChart } from '../api/coinGecko';

export function useMarketChart(assetId, days) {
  const [prices, setPrices] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!assetId) {
      setPrices([]);
      setStatus('idle');
      return undefined;
    }

    const controller = new AbortController();

    async function loadChart() {
      try {
        setStatus('loading');
        const chart = await fetchMarketChart(assetId, days, { signal: controller.signal });
        setPrices((chart.prices ?? []).map((point) => point[1]).filter(Number.isFinite));
        setStatus('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPrices([]);
          setStatus('error');
        }
      }
    }

    loadChart();

    return () => controller.abort();
  }, [assetId, days]);

  return { prices, status };
}
