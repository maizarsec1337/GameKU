const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile, STORAGE_BASE } = require('../helpers/storageHelper');
const { cache, CACHE_KEYS } = require('../services/cacheService');

// Sanitize input helper
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

// Mock data for development when DB not available
const getMockBanners = () => [
  { _id: 'banner-1', title: 'Promo Banner 1', image: '/gambar/banner/default.jpg', link: '/', order: 1 },
  { _id: 'banner-2', title: 'Promo Banner 2', image: '/gambar/banner/default.jpg', link: '/', order: 2 },
  { _id: 'banner-3', title: 'Promo Banner 3', image: '/gambar/banner/default.jpg', link: '/', order: 3 }
];

const getBanners = async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get(CACHE_KEYS.BANNERS || 'banners');
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const { Banner } = require('../../models');
    let banners = [];
    
    // Check if DB is connected
    const mongoose = require('mongoose');
    const isDbConnected = Banner && mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      // Use lean() + select() untuk mengurangi ukuran data
      banners = await Banner.find({ deletedAt: null })
        .sort({ order: 1 })
        .select('title image link order _id')
        .lean()
        .catch(() => []);
    }
    
    // If no data from DB, use mock data for development
    if (banners.length === 0 && process.env.NODE_ENV !== 'production') {
      banners = getMockBanners();
    }
    
    // Cache for 5 minutes
    if (banners.length > 0) {
      cache.set(CACHE_KEYS.BANNERS || 'banners', banners, 300);
    }
    
    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('getBanners error:', error.message);
    // Return mock data on error for development
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ success: true, data: getMockBanners() });
    }
    res.status(500).json({ success: false, message: 'Gagal memuat banner' });
  }
};

const getBannerById = async (req, res) => {
  try {
    const cacheKey = `banner_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const { Banner } = require('../../models');
    if (Banner) {
      const banner = await Banner.findOne({ _id: req.params.id, deletedAt: null })
        .select('title image link order _id')
        .lean();
      if (!banner) {
        return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
      }
      cache.set(cacheKey, banner, 300);
      return res.json({ success: true, data: banner });
    }
    // Return mock for development
    if (process.env.NODE_ENV !== 'production') {
      const banner = getMockBanners().find(b => b._id === req.params.id || b._id === 'banner-1');
      return res.json({ success: true, data: banner });
    }
    res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat banner' });
  }
};

const createBanner = async (req, res) => {
  try {
    const { Banner } = require('../../models');
    const { title, link, order } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul banner wajib diisi'
      });
    }
    
    // Handle file upload
    let imagePath = '/gambar/banner/default.jpg';
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'banner');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (Banner) {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        const banner = new Banner({
          title: sanitizeInput(title),
          image: imagePath,
          link: sanitizeInput(link || '/'),
          order: parseInt(order) || 0,
          active: true
        });
        const saved = await banner.save();
        // Invalidate cache
        cache.del(CACHE_KEYS.BANNERS || 'banners');
        return res.status(201).json({
          success: true,
          message: 'Banner berhasil ditambahkan',
          data: { _id: saved._id, title: saved.title, image: saved.image, link: saved.link, order: saved.order }
        });
      }
    }
    
    // Return mock for development
    if (process.env.NODE_ENV !== 'production') {
      return res.status(201).json({
        success: true,
        message: 'Banner berhasil ditambahkan (mock)',
        data: { title, image: imagePath, link, _id: 'banner-' + Date.now() }
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Banner berhasil ditambahkan',
      data: { title, image: imagePath, link }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { Banner } = require('../../models');
    const { id } = req.params;
    
    if (!Banner) {
      return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
    }
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const banner = await Banner.findOne({ _id: id, deletedAt: null });
      if (!banner) {
        return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
      }
      
      const { title, link, active, order } = req.body;
      
      // Handle file upload for new image
      if (req.file) {
        try {
          const oldImage = banner.image;
          if (oldImage && oldImage.startsWith('/storage/')) {
            await deleteFile(oldImage);
          }
          const storagePath = await saveFile(req.file, 'image', 'banner');
          banner.image = storagePath;
        } catch (uploadError) {
          return res.status(400).json({ success: false, message: uploadError.message });
        }
      }
      
      if (title !== undefined) banner.title = sanitizeInput(title);
      if (link !== undefined) banner.link = sanitizeInput(link);
      if (active !== undefined) banner.active = active;
      if (order !== undefined) banner.order = parseInt(order);
      
      await banner.save();
      
      // Invalidate cache
      cache.del(CACHE_KEYS.BANNERS || 'banners');
      cache.del(`banner_${id}`);
      
      return res.json({
        success: true,
        message: 'Banner berhasil diupdate',
        data: { _id: banner._id, title: banner.title, image: banner.image, link: banner.link, order: banner.order }
      });
    }
    
    // Return mock for development
    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        success: true,
        message: 'Banner berhasil diupdate (mock)',
        data: { title: req.body.title, link: req.body.link, _id: id }
      });
    }
    
    res.status(500).json({ success: false, message: 'Database tidak tersedia' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { Banner } = require('../../models');
    const { id } = req.params;
    
    if (!Banner) {
      return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
    }
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const banner = await Banner.findOne({ _id: id, deletedAt: null });
      
      if (!banner) {
        return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
      }
      
      // Delete image file
      const image = banner.image;
      if (image && image.startsWith('/storage/')) {
        await deleteFile(image);
      }
      
      // Soft delete
      banner.deletedAt = new Date();
      await banner.save();
      
      // Invalidate cache
      cache.del(CACHE_KEYS.BANNERS || 'banners');
      cache.del(`banner_${id}`);
      
      return res.json({
        success: true,
        message: 'Banner berhasil dihapus'
      });
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        success: true,
        message: 'Banner berhasil dihapus (mock)'
      });
    }
    
    res.status(500).json({ success: false, message: 'Database tidak tersedia' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getBanners, 
  getBannerById, 
  createBanner, 
  updateBanner, 
  deleteBanner 
};