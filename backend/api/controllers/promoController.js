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

// Mock data for development when DB not available
const getMockPromos = () => [
  { _id: 'promo-1', title: 'Promo Banner 1', image: '/gambar/promo/default.jpg', discount: 20, description: 'Diskon 20% untuk semua produk', active: true },
  { _id: 'promo-2', title: 'Promo Banner 2', image: '/gambar/promo/default.jpg', discount: 10, description: 'Diskon 10% untuk produk tertentu', active: true },
  { _id: 'promo-3', title: 'Promo Banner 3', image: '/gambar/promo/default.jpg', discount: 15, description: 'Diskon 15% untuk kategori tertentu', active: true }
];

const getPromos = async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get(CACHE_KEYS.PROMOS || 'promos');
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const { Promo } = require('../../models');
    let promos = [];
    
    const isDbConnected = Promo && mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      promos = await Promo.find({ deletedAt: null, active: true })
        .select('title image discount description expiredAt productIds _id')
        .lean()
        .catch(() => []);
    }
    
    // If no data from DB, use mock data for development
    if (promos.length === 0 && process.env.NODE_ENV !== 'production') {
      promos = getMockPromos();
    }
    
    // Cache for 5 minutes
    if (promos.length > 0) {
      cache.set(CACHE_KEYS.PROMOS || 'promos', promos, 300);
    }
    
    res.json({
      success: true,
      data: promos
    });
  } catch (error) {
    console.error('getPromos error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ success: true, data: getMockPromos() });
    }
    res.status(500).json({ success: false, message: 'Gagal memuat promo' });
  }
};

const getPromoById = async (req, res) => {
  try {
    const cacheKey = `promo_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const { Promo } = require('../../models');
    if (Promo && mongoose.connection.readyState === 1) {
      const promo = await Promo.findOne({ _id: req.params.id, deletedAt: null })
        .select('title image discount description expiredAt productIds _id')
        .lean();
      if (!promo) {
        return res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
      }
      cache.set(cacheKey, promo, 300);
      return res.json({ success: true, data: promo });
    }
    if (process.env.NODE_ENV !== 'production') {
      const promo = getMockPromos().find(p => p._id === req.params.id) || getMockPromos()[0];
      return res.json({ success: true, data: promo });
    }
    res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat promo' });
  }
};

const createPromo = async (req, res) => {
  try {
    const { Promo } = require('../../models');
    const { title, discount, active, description, expiredAt, productIds } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul promo wajib diisi'
      });
    }
    
    let imagePath = '/gambar/promo/default.png';
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'promo');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (Promo && mongoose.connection.readyState === 1) {
      const promo = new Promo({
        title: sanitizeInput(title),
        image: imagePath,
        discount: parseInt(discount) || 0,
        description: sanitizeInput(description || ''),
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        productIds: Array.isArray(productIds) ? productIds : [],
        active: active !== undefined ? active : true
      });
      const saved = await promo.save();
      cache.del(CACHE_KEYS.PROMOS || 'promos');
      return res.status(201).json({
        success: true,
        message: 'Promo berhasil ditambahkan',
        data: { _id: saved._id, title: saved.title, discount: saved.discount }
      });
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return res.status(201).json({
        success: true,
        message: 'Promo berhasil ditambahkan (mock)',
        data: { title, discount, image: imagePath, _id: 'promo-' + Date.now() }
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Promo berhasil ditambahkan',
      data: { title, discount: imagePath }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePromo = async (req, res) => {
  try {
    const { Promo } = require('../../models');
    const { id } = req.params;
    const { title, discount, active, description, expiredAt, productIds } = req.body;
    
    if (!Promo || mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
    }
    
    const promo = await Promo.findOne({ _id: id, deletedAt: null });
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
    }
    
    if (req.file) {
      try {
        const oldImage = promo.image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        const storagePath = await saveFile(req.file, 'image', 'promo');
        promo.image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({ success: false, message: uploadError.message });
      }
    }
    
    if (title !== undefined) promo.title = sanitizeInput(title);
    if (discount !== undefined) promo.discount = parseInt(discount) || 0;
    if (active !== undefined) promo.active = active;
    if (description !== undefined) promo.description = sanitizeInput(description);
    if (expiredAt !== undefined) promo.expiredAt = expiredAt ? new Date(expiredAt) : null;
    if (productIds !== undefined) promo.productIds = Array.isArray(productIds) ? productIds : [];
    
    await promo.save();
    
    cache.del(CACHE_KEYS.PROMOS || 'promos');
    cache.del(`promo_${id}`);
    
    res.json({
      success: true,
      message: 'Promo berhasil diupdate',
      data: { _id: promo._id, title: promo.title, discount: promo.discount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePromo = async (req, res) => {
  try {
    const { Promo } = require('../../models');
    const { id } = req.params;
    
    if (!Promo || mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
    }
    
    const promo = await Promo.findOne({ _id: id, deletedAt: null });
    
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
    }
    
    const image = promo.image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    promo.deletedAt = new Date();
    await promo.save();
    
    cache.del(CACHE_KEYS.PROMOS || 'promos');
    cache.del(`promo_${id}`);
    
    res.json({
      success: true,
      message: 'Promo berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getPromos, 
  getPromoById, 
  createPromo, 
  updatePromo, 
  deletePromo 
};