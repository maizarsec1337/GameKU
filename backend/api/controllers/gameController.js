const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile } = require('../helpers/storageHelper');
const { cache, CACHE_KEYS } = require('../services/cacheService');

// Sanitize input helper
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

const getGames = async (req, res) => {
  try {
    // If category query param is provided, return products by category with cache
    if (req.query && req.query.category) {
      const categoryValue = req.query.category;
      const cacheKey = `games_${categoryValue}`;
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const { Product, ProductCategory } = require('../../models');
      let products = [];
      
      if (Product) {
        // Try to find categoryId from ProductCategory by slug
        let categoryMatch = null;
        if (ProductCategory) {
          categoryMatch = await ProductCategory.findOne({ 
            slug: categoryValue, 
            deletedAt: null 
          }).select('_id slug').lean().catch(() => null);
        }
        
        // Build query
        const query = { deletedAt: null, status: 'active' };
        
        // Match by Product.category field if it's a direct enum value
        const validCategories = ['topup', 'steam', 'giftcard', 'game', 'randomkey', 'item', 'joki', 'voucher'];
        if (validCategories.includes(categoryValue)) {
          query.category = categoryValue;
        }
        
        // Also match by categoryId if we found the category document
        if (categoryMatch) {
          query.$or = [
            { category: categoryValue },
            { categoryId: categoryMatch._id }
          ];
        }

        // Use lean() + select() + limit() untuk optimasi
        products = await Product.find(query)
          .sort({ createdAt: -1 })
          .select('name image price category originalPrice discount _id slug sellerId')
          .limit(50)
          .lean()
          .catch(() => []);
      }
      
      // Cache for 5 minutes
      if (products.length > 0) {
        cache.set(cacheKey, products, 300);
      }
      
      return res.json({ success: true, data: products });
    }
    
    // Default: return list of game categories
    const { ProductCategory } = require('../../models');
    let games = [];
    
    // Check cache
    const cached = cache.get('games_list');
    if (cached) {
      return res.json({ success: true, data: cached });
    }
    
    if (ProductCategory) {
      games = await ProductCategory.find({ 
        categoryType: 'game', 
        deletedAt: null 
      })
        .sort({ order: 1 })
        .select('name slug icon image _id')
        .lean()
        .catch(() => []);
    }
    
    // Cache
    if (games.length > 0) {
      cache.set('games_list', games, 300);
    }
    
    res.json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat game' });
  }
};

const getGameById = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const cacheKey = `game_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    if (ProductCategory) {
      const game = await ProductCategory.findOne({ 
        _id: req.params.id, 
        categoryType: 'game',
        deletedAt: null 
      }).select('name slug icon image _id').lean();
      if (!game) {
        return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
      }
      cache.set(cacheKey, game, 300);
      return res.json({ success: true, data: game });
    }
    res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat game' });
  }
};

const getGameBySlug = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const cacheKey = `game_slug_${req.params.slug}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    if (ProductCategory) {
      const game = await ProductCategory.findOne({ 
        slug: req.params.slug, 
        categoryType: 'game',
        deletedAt: null 
      }).select('name slug icon image _id').lean();
      if (!game) {
        return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
      }
      cache.set(cacheKey, game, 300);
      return res.json({ success: true, data: game });
    }
    res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat game' });
  }
};

const createGame = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { name, slug, icon, order } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan slug game wajib diisi'
      });
    }
    
    let imagePath = '/gambar/game/default.png';
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'games');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (ProductCategory) {
      const game = new ProductCategory({
        name: sanitizeInput(name),
        slug: sanitizeInput(slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')),
        icon: icon || '🎮',
        image: imagePath,
        categoryType: 'game',
        order: parseInt(order) || 0
      });
      const saved = await game.save();
      cache.del('games_list');
      return res.status(201).json({
        success: true,
        message: 'Game berhasil ditambahkan',
        data: { _id: saved._id, name: saved.name, slug: saved.slug, icon: saved.icon }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Game berhasil ditambahkan',
      data: { name, slug, icon, image: imagePath }
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

const updateGame = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { id } = req.params;
    const { name, slug, icon, order, active } = req.body;
    
    if (!ProductCategory) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
    }
    
    const game = await ProductCategory.findOne({ 
      _id: id, 
      categoryType: 'game',
      deletedAt: null 
    });
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
    }
    
    // Handle file upload
    if (req.file) {
      try {
        const oldImage = game.image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        const storagePath = await saveFile(req.file, 'image', 'games');
        game.image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({ success: false, message: uploadError.message });
      }
    }
    
    if (name !== undefined) game.name = sanitizeInput(name);
    if (slug !== undefined) game.slug = sanitizeInput(slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''));
    if (icon !== undefined) game.icon = icon;
    if (order !== undefined) game.order = parseInt(order);
    if (active !== undefined) game.active = active;
    
    await game.save();
    
    cache.del('games_list');
    cache.del(`game_${id}`);
    
    res.json({
      success: true,
      message: 'Game berhasil diupdate',
      data: { _id: game._id, name: game.name, slug: game.slug }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { id } = req.params;
    
    if (!ProductCategory) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
    }
    
    const game = await ProductCategory.findOne({ 
      _id: id, 
      categoryType: 'game',
      deletedAt: null 
    });
    
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
    }
    
    // Delete image file
    const image = game.image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    // Soft delete
    game.deletedAt = new Date();
    await game.save();
    
    cache.del('games_list');
    cache.del(`game_${id}`);
    
    res.json({
      success: true,
      message: 'Game berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getGames, 
  getGameById, 
  getGameBySlug,
  createGame, 
  updateGame, 
  deleteGame 
};