const mongoose = require('mongoose');
const { cache, CACHE_KEYS } = require('../services/cacheService');
const { Product, ProductCategory, ProductImage, SearchIndex, Promo, Banner, Voucher } = require('../../models');

// Helper to format price
const formatPrice = (price) => {
  if (!price) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price).replace('IDR', 'Rp');
};

// Helper to calculate discount percentage
const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || !price || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Helper to get product image
const getProductImage = async (productId) => {
  const image = await ProductImage.findOne({ productId, imageType: 'thumbnail' }).lean();
  return image?.path || '/storage/product/default.jpg';
};

// Helper to enrich product data
const enrichProduct = async (product) => {
  const image = await getProductImage(product._id);
  const discount = calculateDiscount(product.price, product.originalPrice);
  
  return {
    _id: product._id,
    id: product._id,
    name: product.name,
    slug: product.slug,
    image: image,
    price: formatPrice(product.price),
    originalPrice: product.originalPrice ? formatPrice(product.originalPrice) : null,
    discount: discount,
    category: product.category,
    platform: product.brand || product.category,
    rating: product.averageRating || 0,
    sold: product.purchaseCount || 0,
    stock: product.stock,
    status: product.status,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    storeName: product.storeName,
    createdAt: product.createdAt,
    isOfficial: product.sellerId?.toString() === 'official' || product.storeName === 'GameKU Official'
  };
};

// ====================
// GET HOME DATA
// ====================
const getHomeData = async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get(CACHE_KEYS.HOME_PRODUCTS);
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const result = {
      categories: [],
      sections: {},
      banners: [],
      promos: []
    };

    // Fetch all active categories
    const categories = await ProductCategory.find({ 
      deletedAt: null, 
      active: true 
    })
      .sort({ order: 1, sortOrder: 1 })
      .lean()
      .catch(() => []);

    result.categories = categories.map(cat => ({
      _id: cat._id,
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '📦',
      image: cat.image || '/storage/category/default.png',
      categoryType: cat.categoryType,
      description: cat.description
    }));

    // Fetch banners
    const banners = await Banner?.find({ deletedAt: null })
      .sort({ order: 1 })
      .lean()
      .catch(() => []);
    result.banners = banners || [];

    // Fetch promos
    const promos = await Promo?.find({ 
      deletedAt: null, 
      active: true 
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .catch(() => []);
    result.promos = promos || [];

    // Build sections dynamically based on categories
    // Group categories by categoryType for main sections
    const categoriesByType = {};
    categories.forEach(cat => {
      const type = cat.categoryType;
      if (!categoriesByType[type]) {
        categoriesByType[type] = [];
      }
      categoriesByType[type].push(cat);
    });

    // For each main category type, get products
    for (const [type, cats] of Object.entries(categoriesByType)) {
      const categoryIds = cats.map(c => c._id);
      
      // Get products for this category type
      const products = await Product?.find({
        $or: [
          { categoryId: { $in: categoryIds } },
          { category: type }
        ],
        status: 'active',
        deletedAt: null
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
        .catch(() => []);

      if (products && products.length > 0) {
        // Enrich each product with image and formatted data
        const enrichedProducts = await Promise.all(
          products.map(p => enrichProduct(p))
        );
        
        result.sections[type] = {
          title: getCategoryTitle(type),
          subtitle: getCategorySubtitle(type),
          categoryType: type,
          products: enrichedProducts
        };
      }
    }

    // Smart sections - calculated from database
    await addSmartSections(result);

    // Cache for 60 seconds (short cache for real-time updates)
    cache.set(CACHE_KEYS.HOME_PRODUCTS, result, 60);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get home data error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat data home'
    });
  }
};

// Get category display title
const getCategoryTitle = (type) => {
  const titles = {
    topup: 'Top Up Games',
    steam: 'Steam Wallet & Key',
    minecraft: 'Minecraft Marketplace',
    giftcard: 'Gift Card',
    voucher: 'Voucher Game',
    game: 'Game Lainnya'
  };
  return titles[type] || type;
};

// Get category display subtitle
const getCategorySubtitle = (type) => {
  const subtitles = {
    topup: 'Produk Official GameKU - Mobile Legends, Free Fire, PUBG, Valorant, Roblox',
    steam: 'Steam Wallet & Game Key dari Marketplace Seller',
    minecraft: 'Akun, Shared Account, Minecoin, Server, Jasa Build, Plugin, Resource Pack',
    giftcard: 'Gift card untuk hiburan digital',
    voucher: 'Voucher untuk berbagai platform game',
    game: 'Game lainnya'
  };
  return subtitles[type] || '';
};

// Add smart sections (Latest, Popular, Top Rated, Best Selling)
const addSmartSections = async (result) => {
  try {
    const allProducts = await Product?.find({
      status: 'active',
      deletedAt: null
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .catch(() => []);

    if (!allProducts || allProducts.length === 0) return;

    // Latest Products
    const latestProducts = await Promise.all(
      allProducts.slice(0, 20).map(p => enrichProduct(p))
    );
    result.sections.latest = {
      title: 'Produk Terbaru',
      subtitle: 'Produk baru yang baru saja ditambahkan',
      products: latestProducts
    };

    // Popular Products (by view count)
    const popularProducts = await Product?.find({
      status: 'active',
      deletedAt: null
    })
      .sort({ viewCount: -1 })
      .limit(20)
      .lean()
      .catch(() => []);
    
    if (popularProducts && popularProducts.length > 0) {
      result.sections.popular = {
        title: 'Produk Populer',
        subtitle: 'Produk paling banyak dilihat',
        products: await Promise.all(popularProducts.map(p => enrichProduct(p)))
      };
    }

    // Top Rated Products
    const topRatedProducts = await Product?.find({
      status: 'active',
      deletedAt: null,
      averageRating: { $gte: 4 }
    })
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(20)
      .lean()
      .catch(() => []);
    
    if (topRatedProducts && topRatedProducts.length > 0) {
      result.sections.topRated = {
        title: 'Rating Tertinggi',
        subtitle: 'Produk dengan rating terbaik',
        products: await Promise.all(topRatedProducts.map(p => enrichProduct(p)))
      };
    }

    // Best Selling Products
    const bestSellingProducts = await Product?.find({
      status: 'active',
      deletedAt: null
    })
      .sort({ purchaseCount: -1 })
      .limit(20)
      .lean()
      .catch(() => []);
    
    if (bestSellingProducts && bestSellingProducts.length > 0) {
      result.sections.bestSelling = {
        title: 'Produk Terlaris',
        subtitle: 'Produk paling banyak terjual',
        products: await Promise.all(bestSellingProducts.map(p => enrichProduct(p)))
      };
    }

    // Flash Sale (products with active promos and discounts)
    const flashSaleProducts = allProducts
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => b.originalPrice - b.price - (a.originalPrice - a.price))
      .slice(0, 20);
    
    if (flashSaleProducts.length > 0) {
      result.sections.flashSale = {
        title: 'Flash Sale',
        subtitle: 'Diskon spesial untuk hari ini',
        products: await Promise.all(flashSaleProducts.map(p => enrichProduct(p)))
      };
    }
  } catch (error) {
    console.error('Add smart sections error:', error);
  }
};

// ====================
// GET PRODUCT BY CATEGORY
// ====================
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryType } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get category to find its ID
    const category = await ProductCategory.findOne({ 
      slug: categoryType, 
      deletedAt: null,
      active: true
    }).lean();

    // If category not found, try finding by categoryType
    const categories = category 
      ? [category] 
      : await ProductCategory.find({ 
          categoryType, 
          deletedAt: null,
          active: true 
        }).lean();

    const categoryIds = categories.map(c => c._id);

    // Build query
    const query = {
      deletedAt: null,
      status: 'active'
    };

    if (categoryIds.length > 0) {
      query.$or = [
        { categoryId: { $in: categoryIds } },
        { category: categoryType }
      ];
    } else {
      query.category = categoryType;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Enrich products
    const enrichedProducts = await Promise.all(
      products.map(p => enrichProduct(p))
    );

    res.json({
      success: true,
      data: enrichedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat produk'
    });
  }
};

// ====================
// INVALIDATE CACHE
// ====================
const invalidateCache = async (req, res) => {
  try {
    cache.del(CACHE_KEYS.HOME_PRODUCTS);
    cache.flushAll && cache.flushAll();
    
    res.json({
      success: true,
      message: 'Cache berhasil diinvalidasi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menginvalidasi cache'
    });
  }
};

module.exports = {
  getHomeData,
  getProductsByCategory,
  invalidateCache
};