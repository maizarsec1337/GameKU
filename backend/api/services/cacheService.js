// Cache Service for GameKU - with fallback if node-cache not installed
let cache;

try {
  const NodeCache = require('node-cache');
  cache = new NodeCache({ stdTTL: 60, checkperiod: 65 });
} catch (e) {
  // Fallback to simple Map-based cache
  console.warn('node-cache not installed, using fallback cache implementation');
  const cacheStore = new Map();
  const cacheTimers = new Map();
  
  cache = {
    get: (key) => cacheStore.get(key),
    set: (key, value, ttl = 60) => {
      cacheStore.set(key, value);
      if (cacheTimers.has(key)) {
        clearTimeout(cacheTimers.get(key));
      }
      cacheTimers.set(key, setTimeout(() => {
        cacheStore.delete(key);
        cacheTimers.delete(key);
      }, ttl * 1000));
    },
    del: (key) => {
      cacheStore.delete(key);
      if (cacheTimers.has(key)) {
        clearTimeout(cacheTimers.get(key));
        cacheTimers.delete(key);
      }
    },
    keys: () => Array.from(cacheStore.keys()),
    flushAll: () => {
      cacheStore.clear();
      cacheTimers.forEach(timer => clearTimeout(timer));
      cacheTimers.clear();
    },
    getStats: () => ({
      keys: cacheStore.size,
      hits: 0,
      misses: 0
    })
  };
}

// Cache keys - optimized for frontend requests
const CACHE_KEYS = {
  BANNERS: 'banners',
  CATEGORIES: 'categories',
  TOPUP_PRODUCTS: 'topup_products',
  STEAM_PRODUCTS: 'steam_products',
  MINECRAFT_PRODUCTS: 'minecraft_products',
  GIFT_CARD_PRODUCTS: 'giftcard_products',
  VOUCHERS: 'vouchers',
  PROMOS: 'promos',
  HOME_PRODUCTS: 'home_products',
  CATEGORY_PRODUCTS: 'category_products_',
  PRODUCT_DETAIL: 'product_',
  SELLER_PRODUCTS: 'seller_products_',
  SELLER_STATS: 'seller_stats_',
  POPULAR_SEARCHES: 'popular_searches',
  TRENDING_SEARCHES: 'trending_searches',
  SELLER_STORE: 'seller_store_'
};

/**
 * Cache Service for GameKU
 * Provides efficient caching with automatic invalidation
 */
class CacheService {
  /**
   * Get cached value
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    try {
      return cache.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return undefined;
    }
  }

  /**
   * Set cached value
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - TTL in seconds (optional, uses default 60)
   */
  set(key, value, ttl = 60) {
    try {
      cache.set(key, value, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached value
   * @param {string} key - Cache key
   */
  del(key) {
    try {
      cache.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Invalidate all cache for a seller
   * @param {string} sellerId - Seller ID
   */
  invalidateSeller(sellerId) {
    try {
      cache.del(CACHE_KEYS.SELLER_PRODUCTS + sellerId);
      cache.del(CACHE_KEYS.SELLER_STATS + sellerId);
      cache.del(CACHE_KEYS.SELLER_STORE + sellerId);
      // Also invalidate home cache since seller products may appear there
      cache.del(CACHE_KEYS.HOME_PRODUCTS);
    } catch (error) {
      console.error('Cache invalidate seller error:', error);
    }
  }

  /**
   * Invalidate all category caches
   */
  invalidateCategories() {
    try {
      const keys = cache.keys();
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEYS.CATEGORY_PRODUCTS)) {
          cache.del(key);
        }
      });
      cache.del(CACHE_KEYS.CATEGORIES);
      cache.del(CACHE_KEYS.HOME_PRODUCTS);
    } catch (error) {
      console.error('Cache invalidate categories error:', error);
    }
  }

  /**
   * Invalidate search caches
   */
  invalidateSearch() {
    try {
      cache.del(CACHE_KEYS.POPULAR_SEARCHES);
      cache.del(CACHE_KEYS.TRENDING_SEARCHES);
    } catch (error) {
      console.error('Cache invalidate search error:', error);
    }
  }

  /**
   * Invalidate product cache
   * @param {string} productId - Product ID (optional)
   */
  invalidateProduct(productId = null) {
    try {
      if (productId) {
        cache.del(CACHE_KEYS.PRODUCT_DETAIL + productId);
      }
      // Invalidate all related caches
      cache.del(CACHE_KEYS.HOME_PRODUCTS);
    } catch (error) {
      console.error('Cache invalidate product error:', error);
    }
  }

  /**
   * Clear all cache
   */
  flushAll() {
    try {
      cache.flushAll();
    } catch (error) {
      console.error('Cache flush all error:', error);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses
    };
  }
}

module.exports = {
  cache: new CacheService(),
  CACHE_KEYS
};