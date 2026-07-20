const { cache, CACHE_KEYS } = require('../services/cacheService');

// Format price helper
const fmt = (n) => 'Rp' + Math.round(n || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 });

// Enrich product with full image paths and formatted data
const enrichProduct = async (product) => {
  if (!product) return null;
  
  const getProductImages = async (productId) => {
    try {
      const { ProductImage } = require('../../models');
      if (!ProductImage) return [];
      const images = await ProductImage.find({ 
        productId: productId, 
        imageType: 'gallery' 
      }).sort({ order: 1 }).lean();
      return images.map(img => img.path).filter(Boolean);
    } catch {
      return [];
    }
  };

  const images = product.images || await getProductImages(product._id);
  const image = images && images.length > 0 
    ? (images[0].startsWith('/') ? images[0] : `/storage/product/${images[0]}`) 
    : (product.image || '/storage/product/default.png');

  return {
    _id: product._id,
    id: product._id,
    name: product.name || 'Tanpa Nama',
    slug: product.slug || '',
    image: image.startsWith('/') ? image : `/storage/product/${image}`,
    priceRp: product.price || 0,
    price: fmt(product.price || 0),
    category: product.category || 'produk',
    originalPrice: product.originalPrice ? fmt(product.originalPrice) : null,
    originalPriceRp: product.originalPrice || null,
    discount: product.originalPrice && product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0,
    stock: product.stock || 0,
    status: product.status || 'active',
    isOfficial: product.isOfficial || product.sellerType === 'official',
    sellerName: product.sellerName,
    storeName: product.storeName,
    averageRating: product.averageRating || 4.5,
    reviewCount: product.ratingCount || 0,
    createdAt: product.createdAt,
    viewCount: product.viewCount || 0,
    purchaseCount: product.purchaseCount || 0
  };
};

// Get home page data - all sections dynamically
const getHomeData = async (req, res) => {
  try {
    const { Product, ProductCategory, Banner, Promo, Voucher } = require('../../models');
    
    // Check cache
    const cacheKey = CACHE_KEYS.HOME;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    // Fetch banners
    let banners = [];
    try {
      if (Banner) {
        banners = await Banner.find({ 
          status: 'active', 
          deletedAt: null,
          $or: [{ startDate: { $lte: new Date() } }, { startDate: null }],
          $and: [{ $or: [{ endDate: { $gte: new Date() } }, { endDate: null }] }]
        })
        .sort({ order: 1 })
        .select('title image link alt')
        .lean()
        .catch(() => []);
      }
    } catch {
      banners = [];
    }

    // Fetch categories (only parent categories)
    let categories = [];
    try {
      if (ProductCategory) {
        categories = await ProductCategory.find({ 
          parent: null,
          categoryType: 'product',
          active: true, 
          deletedAt: null 
        })
        .sort({ order: 1 })
        .select('name slug icon image description')
        .lean()
        .catch(() => []);
      }
    } catch {
      categories = [];
    }

    // Get smart sections
    const sections = [];
    
    // Latest products
    if (Product) {
      const latestProducts = await Product.find({ 
        status: 'active', 
        deletedAt: null 
      })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean()
        .catch(() => []);
      
      const latestEnriched = await Promise.all(latestProducts.map(enrichProduct));
      sections.push({
        type: 'latest',
        title: 'Produk Terbaru',
        subtitle: 'Produk baru kami',
        products: latestEnriched.filter(Boolean)
      });
    }

    // Popular products (by view count)
    if (Product) {
      const popularProducts = await Product.find({ 
        status: 'active', 
        deletedAt: null,
        viewCount: { $gt: 0 }
      })
        .sort({ viewCount: -1 })
        .limit(12)
        .lean()
        .catch(() => []);
      
      const popularEnriched = await Promise.all(popularProducts.map(enrichProduct));
      sections.push({
        type: 'popular',
        title: 'Produk Populer',
        subtitle: 'Paling banyak dilihat',
        products: popularEnriched.filter(Boolean)
      });
    }

    // Best selling products
    if (Product) {
      const bestSellingProducts = await Product.find({ 
        status: 'active', 
        deletedAt: null,
        purchaseCount: { $gt: 0 }
      })
        .sort({ purchaseCount: -1 })
        .limit(12)
        .lean()
        .catch(() => []);
      
      const bestSellingEnriched = await Promise.all(bestSellingProducts.map(enrichProduct));
      sections.push({
        type: 'best-selling',
        title: 'Best Seller',
        subtitle: 'Produk terlaris',
        products: bestSellingEnriched.filter(Boolean)
      });
    }

    // Top-rated products
    if (Product) {
      const topRatedProducts = await Product.find({ 
        status: 'active', 
        deletedAt: null,
        ratingCount: { $gt: 5 }
      })
        .sort({ averageRating: -1 })
        .limit(12)
        .lean()
        .catch(() => []);
      
      const topRatedEnriched = await Promise.all(topRatedProducts.map(enrichProduct));
      sections.push({
        type: 'top-rated',
        title: 'Top Rated',
        subtitle: 'Rating tertinggi',
        products: topRatedEnriched.filter(Boolean)
      });
    }

    // Products by category type (topup, steam, voucher, giftcard, minecraft, etc.)
    const categoryTypes = ['topup', 'steam', 'voucher', 'giftcard', 'minecraft', 'randomkey', 'joki', 'item'];
    const categoryProducts = {};
    
    for (const catType of categoryTypes) {
      try {
        const products = await Product.find({ 
          status: 'active', 
          deletedAt: null,
          category: catType
        })
          .sort({ createdAt: -1 })
          .limit(12)
          .lean()
          .catch(() => []);
        
        categoryProducts[catType] = await Promise.all(products.map(enrichProduct));
      } catch {
        categoryProducts[catType] = [];
      }
    }

    // Promos
    let promos = [];
    try {
      if (Promo) {
        promos = await Promo.find({ 
          active: true, 
          deletedAt: null,
          $or: [{ startDate: { $lte: new Date() } }, { startDate: null }],
          $and: [{ $or: [{ endDate: { $gte: new Date() } }, { endDate: null }] }]
        })
        .sort({ order: 1 })
        .select('title image description')
        .lean()
        .catch(() => []);
      }
    } catch {
      promos = [];
    }

    // Vouchers
    let vouchers = [];
    try {
      if (Voucher) {
        vouchers = await Voucher.find({ 
          active: true, 
          deletedAt: null 
        })
        .sort({ order: 1 })
        .select('name image price discount')
        .lean()
        .catch(() => []);
      }
    } catch {
      vouchers = [];
    }
    
    const result = {
      banners,
      categories,
      sections,
      categoryProducts,
      promos,
      vouchers
    };

    // Cache result for 5 minutes
    cache.set(cacheKey, result, 300);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Home data fetch error:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat data beranda' });
  }
};

// Get products by category type
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryType } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const { Product } = require('../../models');
    
    const cacheKey = `${CACHE_KEYS.CATEGORY_PRODUCTS}${categoryType}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    if (!Product) {
      return res.json({ success: true, data: [] });
    }

    const query = { 
      status: 'active', 
      deletedAt: null 
    };

    // Support both category field and categoryId
    const validCategories = ['topup', 'steam', 'giftcard', 'game', 'randomkey', 'item', 'joki', 'voucher'];
    if (validCategories.includes(categoryType)) {
      query.category = categoryType;
    } else {
      // Try to match by slug
      const { ProductCategory } = require('../../models');
      const category = await ProductCategory.findOne({ 
        slug: categoryType, 
        deletedAt: null 
      }).select('_id').lean();
      
      if (category) {
        query.$or = [
          { category: categoryType },
          { categoryId: category._id }
        ];
      }
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean()
      .catch(() => []);

    const enrichedProducts = await Promise.all(products.map(enrichProduct));
    cache.set(cacheKey, enrichedProducts, 300);

    res.json({ success: true, data: enrichedProducts });
  } catch (error) {
    console.error('Category products fetch error:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat produk kategori' });
  }
};

// Get product detail by ID or slug
const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { Product, ProductImage, ProductCategory } = require('../../models');
    
    const cacheKey = `product_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    if (!Product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Try to find by ID first, then by slug
    let product = await Product.findOne({ 
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { slug: id }
      ],
      deletedAt: null,
      status: { $ne: 'deleted' }
    })
    .populate('categoryId', 'name slug icon')
    .populate('subCategoryId', 'name slug')
    .lean()
    .catch(() => null);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).catch(() => {});

    // Get images
    let images = [];
    try {
      images = await ProductImage.find({ 
        productId: product._id 
      }).sort({ order: 1 }).lean();
    } catch {}

    // Format response
    const formattedProduct = {
      _id: product._id,
      id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description || product.shortInfo || '',
      image: product.image || '/storage/product/default.png',
      images: images.map(img => img.path).filter(Boolean),
      price: product.price || 0,
      originalPrice: product.originalPrice || null,
      category: product.category || (product.categoryId ? product.categoryId.slug : ''),
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      stock: product.stock || 0,
      status: product.status,
      isOfficial: product.isOfficial || product.sellerType === 'official',
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      storeName: product.storeName,
      brand: product.brand,
      averageRating: product.averageRating || 4.5,
      ratingCount: product.ratingCount || 0,
      reviewCount: product.ratingCount || 0,
      viewCount: (product.viewCount || 0) + 1,
      purchaseCount: product.purchaseCount || 0,
      nominals: product.nominals || []
    };

    cache.set(cacheKey, formattedProduct, 300);

    res.json({ success: true, data: formattedProduct });
  } catch (error) {
    console.error('Product detail fetch error:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat detail produk' });
  }
};

module.exports = {
  getHomeData,
  getProductsByCategory,
  getProductDetail
};