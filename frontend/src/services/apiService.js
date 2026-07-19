// ====================
// OPTIMIZED API SERVICE
// - Timeout 8 detik
// - Retry maksimal 3x
// - Cache integration
// ====================

import { dataCache } from './dataCache';

const API_BASE = '/api';
const REQUEST_TIMEOUT = 8000; // 8 detik
const MAX_RETRIES = 3;

const apiService = {
  async get(endpoint, useCache = true, signal = null) {
    // Check cache first
    const cacheKey = endpoint;
    if (useCache) {
      const cached = dataCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    let lastError;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
          signal: signal || controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 menit browser cache
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Cache successful response
        if (useCache && data && data.success) {
          dataCache.set(cacheKey, data);
        }
        
        return data;
      } catch (error) {
        lastError = error;
        if (attempt < MAX_RETRIES && error.name !== 'AbortError') {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 3000)));
        }
      }
    }
    
    // All retries failed - return fallback structure
    return null;
  },

  async post(endpoint, body, signal = null) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API POST Error: ${endpoint}`, error);
      return null;
    }
  }
};

export default apiService;