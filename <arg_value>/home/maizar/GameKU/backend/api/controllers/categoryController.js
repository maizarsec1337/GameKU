const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { saveFile, deleteFile } = require('../helpers/storageHelper');
const { cache, CACHE_KEYS } = require('../services/cacheService');
const { Product, ProductCategory, ProductImage } = require('../../models');

// Sanitize input helper
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

// Helper to format price
const formatPrice = (price) => {
  if (!price) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price).replace('IDR', 'Rp');
};

// Get product image
const getProductImage = async (productId) => {
  const image = await ProductImage.findOne({ productId, imageType: 'thumbnail' }).lean();
  return image?.path || '/storage/product/default.jpg';
};

// Enrich product data with image and formatted price
const enrichProduct = async (product) => {
  const image = await getProductImage(product._id);
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

// ====================
// GET CATEGORIES
// ====================
const getCategories = async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get(CACHE_KEYS.CATEGORIES || 'categories');
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const categories = await ProductCategory.find({ 
      deletedAt: null,
      active: true 
    })
      .sort({ order: 1 })
      .select('name slug icon image categoryType order _id description parentCategory level')
      .lean()
      .catch(() => []);

    // Cache for 5 minutes
    if (categories.length > 0) {
      cache.set(CACHE_KEYS.CATEGORIES || 'categories', categories, 300);
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('getCategories error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal memuat kategori dari database' 
    });
  }
};

// ====================
// GET CATEGORY BY ID
// ====================
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `category_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached });
    }

    // Check if param looks like an ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let category = null;
    let products = [];

    if (isObjectId) {
      category = await ProductCategory.findOne({ 
        _id: id, 
        deletedAt: null,
        active: true
      }).select('name slug icon image categoryType order _id description parentCategory level').lean();
    } else {
      category = await ProductCategory.findOne({ 
        slug: id, 
        deletedAt: null,
        active: true
      }).select('name slug icon image categoryType order _id description parentCategory level').lean();
    }

    if (category) {
      // Get products for this category
      const categoryProducts = await Product.find({
        $or: [
          { categoryId: category._id }, 
          { category: category.slug },
          { subCategoryId: category._id }
        ],
        status: 'active',
        deletedAt: null
      })
        .sort({ createdAt: -1 })
        .select('name image price category originalPrice discount _id slug sellerId sellerName storeName averageRating purchaseCount stock status')
        .limit(50)
        .lean()
        .catch(() => []);

      products = await Promise.all(categoryProducts.map(p => enrichProduct(p)));
    }

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kategori tidak ditemukan' 
      });
    }

    // Cache for 5 minutes
    cache.set(cacheKey, { products, category }, 300);

    return res.json({ 
      success: true, 
      products, 
      category 
    });
  } catch (error) {
    console.error('getCategoryById error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal memuat kategori dari database' 
    });
  }
};

// ====================
// CREATE CATEGORY
// ====================
const createCategory = async (req, res) => {
  try {
    const { name, slug, icon, categoryType, order, description, parentCategory } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan slug kategori wajib diisi'
      });
    }

    let imagePath = '/storage/category/default.png';

    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'category');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }

    const category = new ProductCategory({
      name: sanitizeInput(name),
      slug: sanitizeInput(slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')),
      icon: icon || '📦',
      image: imagePath,
      categoryType: categoryType || 'topup',
      order: parseInt(order) || 0,
      description: sanitizeInput(description || ''),
      parentCategory: parentCategory || null,
      level: parentCategory ? 1 : 0
    });
    const saved = await category.save();
    
    // Invalidate cache
    cache.del(CACHE_KEYS.CATEGORIES || 'categories');

    return res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: { 
        _id: saved._id, 
        name: saved.name, 
        slug: saved.slug, 
        icon: saved.icon,
        categoryType: saved.categoryType
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug sudah digunakan'
      });
    }
    console.error('createCategory error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal membuat kategori' 
    });
  }
};

// ====================
// UPDATE CATEGORY
// ====================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, categoryType, order, active, description } = req.body;

    const category = await ProductCategory.findOne({ _id: id, deletedAt: null });
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kategori tidak ditemukan' 
      });
    }

    // Handle file upload
    if (req.file) {
      try {
        const oldImage = category.image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        const storagePath = await saveFile(req.file, 'image', 'category');
        category.image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({ 
          success: false, 
          message: uploadError.message 
        });
      }
    }

    if (name !== undefined) category.name = sanitizeInput(name);
    if (slug !== undefined) category.slug = sanitizeInput(slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''));
    if (icon !== undefined) category.icon = icon;
    if (categoryType !== undefined) category.categoryType = categoryType;
    if (order !== undefined) category.order = parseInt(order);
    if (active !== undefined) category.active = active;
    if (description !== undefined) category.description = sanitizeInput(description);

    await category.save();

    // Invalidate cache
    cache.del(CACHE_KEYS.CATEGORIES || 'categories');
    cache.del(`category_${id}`);

    res.json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: { 
        _id: category._id, 
        name: category.name, 
        slug: category.slug,
        categoryType: category.categoryType
      }
    });
  } catch (error) {
    console.error('updateCategory error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengupdate kategori' 
    });
  }
};

// ====================
// DELETE CATEGORY (SOFT DELETE)
// ====================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findOne({ _id: id, deletedAt: null });
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kategori tidak ditemukan' 
      });
    }

    // Delete image file
    const image = category.image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }

    // Soft delete
    category.deletedAt = new Date();
    await category.save();

    // Invalidate cache
    cache.del(CACHE_KEYS.CATEGORIES || 'categories');
    cache.del(`category_${id}`);

    res.json({
      success: true,
      message: 'Kategori berhasil dihapus'
    });
  } catch (error) {
    console.error('deleteCategory error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menghapus kategori' 
    });
  }
};

module.exports = { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};