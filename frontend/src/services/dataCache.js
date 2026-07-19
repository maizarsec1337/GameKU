// ====================
// FRONTEND DATA CACHE
// TTL: 5 menit
// ====================

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class DataCache {
  constructor() {
    this.cache = new Map();
  }

  // Get data from cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check TTL
    if (Date.now() - item.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Set data to cache
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Check if cache exists and valid
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    return Date.now() - item.timestamp <= CACHE_TTL;
  }

  // Clear specific cache
  clear(key) {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll() {
    this.cache.clear();
  }
}

// Singleton instance
export const dataCache = new DataCache();

// Cache keys
export const CACHE_KEYS = {
  BANNERS: 'banners',
  CATEGORIES: 'categories',
  TOPUP_PRODUCTS: 'topup_products',
  STEAM_PRODUCTS: 'steam_products',
  MINECRAFT_PRODUCTS: 'minecraft_products',
  GIFT_CARD_PRODUCTS: 'giftcard_products',
  VOUCHERS: 'vouchers',
  PROMOS: 'promos'
};

export default DataCache;