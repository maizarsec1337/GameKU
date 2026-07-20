const { Product, ProductCategory, ProductImage, SearchIndex } = require('../../models');
const { cache, CACHE_KEYS } = require('./cacheService');

// Pending publications queue (in-memory, for production use Redis)
const pendingPublications = new Map();
const PUBLISH_DELAY_MS = 30000; // 30 seconds

// Helper to format price
const formatPrice = (price) => {
  if (!price) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price).replace('IDR', 'Rp');
};

// Helper to get product image
const getProductImage = async (productId) => {
  const image = await ProductImage.findOne({ productId, imageType: 'thumbnail' }).lean();
  return image?.path || '/storage/product/default.jpg';
};

// Enrich product data
const enrichProduct = async (product) => {
  const image = await getProductImage(product._id);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  
  return {
    ...product,
    id: product._id,
    price: formatPrice(product.price),
    originalPrice: product.originalPrice ? formatPrice(product.originalPrice) : null,
    image: image,
    rating: product.averageRating || 0,
    sold: product.purchaseCount || 0
  };
};

/**
 * Schedule product for automatic publishing after 30 seconds
 * @param {string} productId - Product ID
 * @param {Object} productData - Full product data
 */
const scheduleProductPublish = (productId, productData) => {
  // Store in pending queue
  pendingPublications.set(productId, {
    product: productData,
    scheduledAt: Date.now(),
    publishAt: Date.now() + PUBLISH_DELAY_MS
  });

  console.log(`Product ${productId} scheduled for publishing in ${PUBLISH_DELAY_MS / 1000} seconds`);
};

/**
 * Process pending publications - check and publish due products
 */
const processPendingPublications = async () => {
  const now = Date.now();
  const toPublish = [];

  for (const [productId, data] of pendingPublications.entries()) {
    if (now >= data.publishAt) {
      toPublish.push({ productId, data });
    }
  }

  for (const { productId } of toPublish) {
    await publishProduct(productId);
    pendingPublications.delete(productId);
  }

  return toPublish.length;
};

/**
 * Publish a product - update status to active and index for search
 * @param {string} productId - Product ID
 */
const publishProduct = async (productId) => {
  try {
    const product = await Product.findOne({ _id: productId, deletedAt: null });
    
    if (!product) {
      return false;
    }

    // Update status to active and set publishedAt
    product.status = 'active';
    product.publishedAt = new Date();
    await product.save();

    // Index for search
    const searchService = require('./searchService');
    await searchService.indexProduct(productId);

    // Invalidate caches
    cache.invalidateProduct();
    cache.flushAll && cache.flushAll();

    console.log(`Product ${productId} published successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to publish product ${productId}:`, error.message);
    return false;
  }
};

/**
 * Cancel a pending publication
 * @param {string} productId - Product ID
 */
const cancelProductPublish = (productId) => {
  pendingPublications.delete(productId);
};

/**
 * Get count of pending publications
 */
const getPendingCount = () => {
  return pendingPublications.size;
};

/**
 * Start the scheduler interval
 */
const startScheduler = () => {
  // Process pending publications every 5 seconds
  setInterval(async () => {
    const count = await processPendingPublications();
    if (count > 0) {
      console.log(`Published ${count} products`);
    }
  }, 5000);

  console.log('Product scheduler started (30-second publish delay)');
};

module.exports = {
  scheduleProductPublish,
  publishProduct,
  cancelProductPublish,
  getPendingCount,
  startScheduler,
  pendingPublications
};