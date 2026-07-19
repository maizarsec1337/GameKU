import { useCallback } from 'react';
import apiService from '../services/apiService';

// Prefetch hook untuk navigasi instan
export function usePrefetch() {
  const prefetchData = useCallback(async (endpoint) => {
    // Fetch tanpa menunggu response (fire and forget)
    apiService.get(endpoint, false).catch(() => {});
  }, []);

  const prefetchCategory = useCallback((category) => {
    prefetchData(`/category/${category}`);
    prefetchData(`/game?category=${category}`);
  }, [prefetchData]);

  const prefetchRoute = useCallback((route) => {
    switch (route) {
      case 'topup':
        prefetchCategory('topup');
        break;
      case 'voucher':
        prefetchCategory('voucher');
        break;
      case 'steam':
        prefetchCategory('steam');
        break;
      case 'minecraft':
        prefetchCategory('minecraft');
        break;
      case 'giftcard':
        prefetchCategory('giftcard');
        break;
      case 'promo':
        prefetchData('/promo');
        break;
      default:
        break;
    }
  }, [prefetchCategory, prefetchData]);

  return { prefetchRoute, prefetchData };
}

export default usePrefetch;