import { useEffect, useState } from 'react';
import { fetchCoinDetails } from '../api/coinGecko';

export function useCoinDetails(assetId) {
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assetId) {
      setDetails(null);
      setStatus('idle');
      setError('');
      return undefined;
    }

    const controller = new AbortController();

    async function loadDetails() {
      try {
        setStatus('loading');
        setError('');
        const nextDetails = await fetchCoinDetails(assetId, { signal: controller.signal });
        setDetails(nextDetails);
        setStatus('success');
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Extended coin profile is unavailable right now.');
          setStatus('error');
        }
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [assetId]);

  return { details, status, error };
}
