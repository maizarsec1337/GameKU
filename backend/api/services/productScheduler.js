const { Product, SearchIndex } = require('../../models');
const { cache, CACHE_KEYS } = require('./cacheService');

/**
 * Product Scheduler Service
 * Handles automatic publishing of products after 30 seconds
 */
class ProductScheduler {
  constructor() {
    this.pendingPublications = new Map();
    this.isRunning = false;
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('✓ Product scheduler started');
    
    // Process pending publications every 5 seconds
    this.interval = setInterval(() => {
      this.processPendingPublications();
    }, 5000);
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.isRunning = false;
    console.log('✓ Product scheduler stopped');
  }

  /**
   * Schedule a product for automatic publishing after 30 seconds
   * @param {string} productId - Product ID to schedule
   * @param {object} product - Product data (optional, for immediate use)
   */
  scheduleProductPublish(productId, product = null) {
    if (!productId) return;

    // Remove any existing scheduled publication
    this.cancelProductPublish(productId);

    const scheduledTime = new Date(Date.now() + 30000); // 30 seconds
    
    this.pendingPublications.set(productId, {
      scheduledTime,
      product
    });

    console.log(`[ProductScheduler] Scheduled product ${productId} for publishing at ${scheduledTime.toISOString()}`);
  }

  /**
   * Cancel a pending product publication
   * @param {string} productId - Product ID to cancel
   */
  cancelProductPublish(productId) {
    if (this.pendingPublications.has(productId)) {
      this.pendingPublications.delete(productId);
      console.log(`[ProductScheduler] Cancelled scheduled publication for product ${productId}`);
    }
  }

  /**
   * Process all pending publications
   */
  async processPendingPublications() {
    if (!Product || this.pendingPublications.size === 0) return;

    const now = new Date();
    
    for (const [productId, scheduled] of this.pendingPublications.entries()) {
      if (scheduled.scheduledTime <= now) {
        try {
          // Update product status to active
          const product = await Product.findByIdAndUpdate(
            productId,
            { 
              status: 'active',
              publishedAt: new Date()
            },
            { new: true }
          ).lean();

          if (product) {
            // Index for search
            await this.indexProductForSearch(productId);
            
            // Invalidate caches
            cache.del(CACHE_KEYS.HOME_PRODUCTS);
            cache.del(CACHE_KEYS.HOME);
            
            console.log(`[ProductScheduler] Auto-published product ${productId}`);
          }
        } catch (error) {
          console.error(`[ProductScheduler] Error publishing product ${productId}:`, error);
        } finally {
          this.pendingPublications.delete(productId);
        }
      }
    }
  }

  /**
   * Index a product for search
   * @param {string} productId - Product ID
   */
  async indexProductForSearch(productId) {
    try {
      if (!Product || !SearchIndex) return;

      const product = await Product.findById(productId)
        .populate('categoryId')
        .populate('tags')
        .lean();

      if (!product) return;

      // Build search keywords
      const keywords = [
        product.name,
        product.slug,
        product.description,
        product.brand,
        product.categoryId?.name,
        product.categoryId?.slug,
        ...(product.tagNames || []),
        ...(product.tags?.map(t => t.name) || [])
      ].filter(Boolean).join(' ').toLowerCase();

      // Calculate scores
      const popularityScore = (product.viewCount || 0) + (product.purchaseCount || 0) * 10;

      // Upsert search index
      await SearchIndex.findOneAndUpdate(
        { productId: product._id },
        {
          searchKeywords: keywords,
          productName: product.name,
          slug: product.slug,
          categoryName: product.categoryId?.name,
          categoryType: product.category,
          tags: product.tags?.map(t => t.name) || [],
          brand: product.brand,
          sellerName: product.sellerName,
          popularityScore,
          trendingScore: 0,
          status: 'active',
          $inc: { searchCount: 0 }
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Index product for search error:', error);
    }
  }

  /**
   * Get scheduled products count
   */
  getPendingCount() {
    return this.pendingPublications.size;
  }
}

// Export singleton instance
const scheduler = new ProductScheduler();

// Auto-start when module is loaded
scheduler.start();

module.exports = scheduler;