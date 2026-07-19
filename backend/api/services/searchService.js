const { Product, SearchIndex, ProductCategory, ProductTag } = require('../../models');

/**
 * Search Service for GameKU
 * Handles product indexing and search functionality
 */
class SearchService {
  /**
   * Index a product for search
   * @param {string} productId - Product ID
   */
  async indexProduct(productId) {
    try {
      const product = await Product.findById(productId)
        .populate('categoryId')
        .populate('tags')
        .lean();
      
      if (!product) {
        throw new Error('Produk tidak ditemukan');
      }

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
      const trendingScore = product.viewCount > 0 ? 
        (product.purchaseCount || 0) / product.viewCount * 100 : 0;

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
          trendingScore,
          status: product.status,
          $inc: { searchCount: 0 }
        },
        { upsert: true, new: true }
      );

      return true;
    } catch (error) {
      console.error('Index product error:', error);
      return false;
    }
  }

  /**
   * Remove product from search index
   * @param {string} productId - Product ID
   */
  async removeProductIndex(productId) {
    try {
      await SearchIndex.deleteOne({ productId });
      return true;
    } catch (error) {
      console.error('Remove product index error:', error);
      return false;
    }
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {object} options - Search options
   */
  async searchProducts(query, options = {}) {
    try {
      const { limit = 20, skip = 0, categoryId = null, status = 'active' } = options;
      
      // Build aggregation pipeline
      const pipeline = [];
      
      // Match stage - text search or status filter
      if (query) {
        pipeline.push({
          $match: {
            $text: { $search: query },
            status
          }
        });
      } else {
        pipeline.push({
          $match: { status }
        });
      }
      
      // Filter by category if provided
      if (categoryId) {
        pipeline.push({
          $match: { categoryType: categoryId }
        });
      }
      
      // Sort by score and popularity
      pipeline.push({
        $addFields: {
          score: {
            $add: [
              { $multiply: ['$popularityScore', 0.3] },
              { $multiply: ['$trendingScore', 0.5] },
              { $cond: [{ $regexMatch: { input: { $toLower: '$searchKeywords' }, regex: query?.toLowerCase() || '' } }, 100, 0] }
            ]
          }
        }
      });
      
      pipeline.push({ $sort: { score: -1 } });
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
      
      const results = await SearchIndex.aggregate(pipeline);
      
      // Get product IDs and fetch actual products
      const productIds = results.map(r => r.productId);
      
      if (productIds.length === 0) {
        return [];
      }
      
      // Fetch products with their images
      const products = await Product.find({ _id: { $in: productIds } })
        .populate({
          path: 'images',
          match: { imageType: 'gallery' }
        })
        .populate({
          path: 'thumbnail',
          match: { imageType: 'thumbnail' }
        })
        .populate('tags')
        .lean();
      
      return products;
    } catch (error) {
      console.error('Search products error:', error);
      return [];
    }
  }

  /**
   * Record search query for analytics
   * @param {string} query - Search query
   */
  async recordSearch(query) {
    try {
      if (!query || query.length < 2) return;
      
      // Update or create search index entries
      await SearchIndex.updateMany(
        { $text: { $search: query } },
        { 
          $inc: { searchCount: 1 },
          $set: { lastSearched: new Date() }
        }
      );
    } catch (error) {
      console.error('Record search error:', error);
    }
  }

  /**
   * Get popular searches
   * @param {number} limit - Limit results
   */
  async getPopularSearches(limit = 10) {
    try {
      // Get searches with highest searchCount
      const popular = await SearchIndex.find({ status: 'active' })
        .sort({ searchCount: -1, popularityScore: -1 })
        .limit(limit)
        .select('productName searchKeywords searchCount')
        .lean();
      
      // Extract unique search terms
      const seen = new Set();
      return popular
        .map(item => item.productName || item.searchKeywords?.split(' ')[0])
        .filter(name => name && !seen.has(name) && seen.add(name));
    } catch (error) {
      console.error('Get popular searches error:', error);
      return [];
    }
  }

  /**
   * Get trending searches
   * @param {number} limit - Limit results
   */
  async getTrendingSearches(limit = 10) {
    try {
      // Get products with trending score
      const trending = await SearchIndex.find({ 
        status: 'active',
        trendingScore: { $gt: 0 }
      })
        .sort({ trendingScore: -1 })
        .limit(limit)
        .select('productName searchKeywords trendingScore')
        .lean();
      
      return trending.map(item => ({
        name: item.productName || item.searchKeywords?.split(' ')[0],
        score: item.trendingScore
      }));
    } catch (error) {
      console.error('Get trending searches error:', error);
      return [];
    }
  }

  /**
   * Update product scores after purchase/view
   * @param {string} productId - Product ID
   * @param {object} updates - Updates to apply
   */
  async updateScores(productId, updates = {}) {
    try {
      const updateData = {};
      
      if (updates.purchase) {
        updateData.$inc = { 
          purchaseCount: 1,
          popularityScore: 10
        };
      }
      
      if (updates.view) {
        updateData.$inc = { 
          viewCount: 1,
          popularityScore: 1
        };
      }
      
      await Product.findByIdAndUpdate(productId, updateData);
      
      // Re-index for search
      await this.indexProduct(productId);
    } catch (error) {
      console.error('Update scores error:', error);
    }
  }
}

/**
 * Main search method for controllers
 * @param {string} query - Search query
 * @param {object} options - Search options
 */
SearchService.prototype.search = async function(query, options = {}) {
  try {
    const { limit = 20, page = 1, type, category } = options;
    const skip = (page - 1) * limit;
    
    // Try to search in Product collection directly
    const Product = require('../../models').Product;
    
    if (Product) {
      // Build query filter
      let filter = { deletedAt: null };
      
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { slug: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ];
      }
      
      if (type === 'game') {
        filter.category = 'game';
      } else if (type === 'voucher') {
        filter.category = 'voucher';
      }
      
      const [products, total] = await Promise.all([
        Product.find(filter)
          .populate('categoryId', 'name slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter)
      ]);
      
      return { results: products, total };
    }
    
    return { results: [], total: 0 };
  } catch (error) {
    console.error('Search error:', error);
    return { results: [], total: 0 };
  }
};

/**
 * Get search suggestions
 * @param {string} query - Search query
 */
SearchService.prototype.getSuggestions = async function(query) {
  try {
    const Product = require('../../models').Product;
    
    if (Product) {
      const suggestions = await Product.find({
        deletedAt: null,
        name: { $regex: query, $options: 'i' }
      })
        .select('name slug')
        .limit(5)
        .lean();
      
      return suggestions.map(s => ({ name: s.name, slug: s.slug }));
    }
    
    return [];
  } catch (error) {
    console.error('Get suggestions error:', error);
    return [];
  }
};

module.exports = new SearchService();
