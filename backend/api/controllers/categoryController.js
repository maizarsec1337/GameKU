const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { saveFile, deleteFile } = require('../helpers/storageHelper');
const { cache, CACHE_KEYS } = require('../services/cacheService');

// Sanitize input helper
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

const getCategories = async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get(CACHE_KEYS.CATEGORIES);
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const { ProductCategory } = require('../../models');
    let categories = [];
    
    const isDbConnected = ProductCategory && mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      categories = await ProductCategory.find({ deletedAt: null })
        .sort({ order: 1 })
        .select('name slug icon image categoryType order _id')
        .lean()
        .catch(() => []);
    }
    
    // Return empty array if no categories - no mock data
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('getCategories error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal memuat kategori' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const cacheKey = `category_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached });
    }

    const { ProductCategory, Product } = require('../../models');
    
    // Check if param looks like an ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    let category = null;
    let products = [];
    
    const isDbConnected = ProductCategory && mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      try {
        if (isObjectId) {
          category = await ProductCategory.findOne({ _id: req.params.id, deletedAt: null })
            .select('name slug icon image categoryType order _id')
            .lean();
        } else {
          category = await ProductCategory.findOne({ slug: req.params.id, deletedAt: null })
            .select('name slug icon image categoryType order _id')
            .lean();
        }
        
        if (category && Product) {
          products = await Product.find({
            $or: [{ categoryId: category._id }, { category: category.slug }],
            status: 'active',
            deletedAt: null
          })
          .sort({ createdAt: -1 })
          .select('name image price category originalPrice discount _id slug')
          .limit(50)
          .lean()
          .catch(() => []);
        }
      } catch (dbError) {
        console.error('DB query error:', dbError.message);
      }
    }
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    
    // Cache for 5 minutes
    cache.set(cacheKey, { products, category }, 300);
    
    return res.json({ success: true, products, category });
  } catch (error) {
    console.error('getCategoryById error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal memuat kategori' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { name, slug, icon, categoryType, order } = req.body;
    
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
    
    if (ProductCategory && mongoose.connection.readyState === 1) {
      const category = new ProductCategory({
        name: sanitizeInput(name),
        slug: sanitizeInput(slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')),
        icon: icon || '📦',
        image: imagePath,
        categoryType: categoryType || 'topup',
        order: parseInt(order) || 0
      });
      const saved = await category.save();
      
      // Invalidate cache
      cache.del(CACHE_KEYS.CATEGORIES);
      cache.del(CACHE_KEYS.HOME);
      
      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil ditambahkan',
        data: { _id: saved._id, name: saved.name, slug: saved.slug, icon: saved.icon }
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Database tidak tersedia'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug sudah digunakan'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { id } = req.params;
    const { name, slug, icon, categoryType, order, active } = req.body;
    
    if (!ProductCategory || mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    
    const category = await ProductCategory.findOne({ _id: id, deletedAt: null });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
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
        return res.status(400).json({ success: false, message: uploadError.message });
      }
    }
    
    if (name !== undefined) category.name = sanitizeInput(name);
    if (slug !== undefined) category.slug = sanitizeInput(slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''));
    if (icon !== undefined) category.icon = icon;
    if (categoryType !== undefined) category.categoryType = categoryType;
    if (order !== undefined) category.order = parseInt(order);
    if (active !== undefined) category.active = active;
    
    await category.save();
    
    // Invalidate cache
    cache.del(CACHE_KEYS.CATEGORIES);
    cache.del(CACHE_KEYS.HOME);
    cache.del(`category_${id}`);
    
    res.json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: { _id: category._id, name: category.name, slug: category.slug }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { id } = req.params;
    
    if (!ProductCategory || mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    
    const category = await ProductCategory.findOne({ _id: id, deletedAt: null });
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
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
    cache.del(CACHE_KEYS.CATEGORIES);
    cache.del(CACHE_KEYS.HOME);
    cache.del(`category_${id}`);
    
    res.json({
      success: true,
      message: 'Kategori berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};