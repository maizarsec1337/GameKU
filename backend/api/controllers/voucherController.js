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
const getMockVouchers = () => [
  { _id: 'voucher-1', code: 'GAMEKU20', discount: 20, image: '/gambar/voucher/default.png', active: true, minPurchase: 0, maxDiscount: 50000 },
  { _id: 'voucher-2', code: 'DISKON10', discount: 10, image: '/gambar/voucher/default.png', active: true, minPurchase: 0, maxDiscount: 30000 },
  { _id: 'voucher-3', code: 'HEMAT15', discount: 15, image: '/gambar/voucher/default.png', active: true, minPurchase: 0, maxDiscount: 40000 }
];

const getVouchers = async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get(CACHE_KEYS.VOUCHERS || 'vouchers');
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const { Voucher } = require('../../models');
    let vouchers = [];
    
    const isDbConnected = Voucher && mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      vouchers = await Voucher.find({ deletedAt: null, active: true })
        .select('code discount image active minPurchase maxDiscount expiredAt _id')
        .lean()
        .catch(() => []);
    }
    
    // If no data from DB, use mock data for development
    if (vouchers.length === 0 && process.env.NODE_ENV !== 'production') {
      vouchers = getMockVouchers();
    }
    
    // Cache for 5 minutes
    if (vouchers.length > 0) {
      cache.set(CACHE_KEYS.VOUCHERS || 'vouchers', vouchers, 300);
    }
    
    res.json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    console.error('getVouchers error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ success: true, data: getMockVouchers() });
    }
    res.status(500).json({ success: false, message: 'Gagal memuat voucher' });
  }
};

const getVoucherById = async (req, res) => {
  try {
    const cacheKey = `voucher_${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const { Voucher } = require('../../models');
    if (Voucher && mongoose.connection.readyState === 1) {
      const voucher = await Voucher.findOne({ _id: req.params.id, deletedAt: null })
        .select('code discount image active minPurchase maxDiscount expiredAt _id')
        .lean();
      if (!voucher) {
        return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
      }
      cache.set(cacheKey, voucher, 300);
      return res.json({ success: true, data: voucher });
    }
    if (process.env.NODE_ENV !== 'production') {
      const voucher = getMockVouchers().find(v => v._id === req.params.id) || getMockVouchers()[0];
      return res.json({ success: true, data: voucher });
    }
    res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat voucher' });
  }
};

const createVoucher = async (req, res) => {
  try {
    const { Voucher } = require('../../models');
    const { code, discount, active, minPurchase, maxDiscount, expiredAt, limitPerUser, limitTotal } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Kode voucher wajib diisi'
      });
    }
    
    let imagePath = '/gambar/voucher/default.png';
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'voucher');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (Voucher && mongoose.connection.readyState === 1) {
      const voucher = new Voucher({
        code: sanitizeInput(code).toUpperCase(),
        image: imagePath,
        active: active !== undefined ? active : true,
        minPurchase: parseInt(minPurchase) || 0,
        maxDiscount: maxDiscount ? parseInt(maxDiscount) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        limitPerUser: parseInt(limitPerUser) || 1,
        limitTotal: limitTotal ? parseInt(limitTotal) : null
      });
      const saved = await voucher.save();
      cache.del(CACHE_KEYS.VOUCHERS || 'vouchers');
      return res.status(201).json({
        success: true,
        message: 'Voucher berhasil ditambahkan',
        data: { _id: saved._id, code: saved.code, discount: saved.discount }
      });
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return res.status(201).json({
        success: true,
        message: 'Voucher berhasil ditambahkan (mock)',
        data: { code, discount, image: imagePath, _id: 'voucher-' + Date.now() }
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Voucher berhasil ditambahkan',
      data: { code, discount, image: imagePath }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVoucher = async (req, res) => {
  try {
    const { Voucher } = require('../../models');
    const { id } = req.params;
    const { code, discount, active, minPurchase, maxDiscount, expiredAt, limitPerUser, limitTotal } = req.body;
    
    if (!Voucher || mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    
    const voucher = await Voucher.findOne({ _id: id, deletedAt: null });
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    
    // Handle file upload
    if (req.file) {
      try {
        const oldImage = voucher.image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        const storagePath = await saveFile(req.file, 'image', 'voucher');
        voucher.image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({ success: false, message: uploadError.message });
      }
    }
    
    if (code !== undefined) voucher.code = sanitizeInput(code).toUpperCase();
    if (discount !== undefined) voucher.discount = parseInt(discount) || 0;
    if (active !== undefined) voucher.active = active;
    if (minPurchase !== undefined) voucher.minPurchase = parseInt(minPurchase) || 0;
    if (maxDiscount !== undefined) voucher.maxDiscount = maxDiscount ? parseInt(maxDiscount) : null;
    if (expiredAt !== undefined) voucher.expiredAt = expiredAt ? new Date(expiredAt) : null;
    if (limitPerUser !== undefined) voucher.limitPerUser = parseInt(limitPerUser) || 1;
    if (limitTotal !== undefined) voucher.limitTotal = limitTotal ? parseInt(limitTotal) : null;
    
    await voucher.save();
    
    cache.del(CACHE_KEYS.VOUCHERS || 'vouchers');
    cache.del(`voucher_${id}`);
    
    res.json({
      success: true,
      message: 'Voucher berhasil diupdate',
      data: { _id: voucher._id, code: voucher.code, discount: voucher.discount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const { Voucher } = require('../../models');
    const { id } = req.params;
    
    if (!Voucher || mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    
    const voucher = await Voucher.findOne({ _id: id, deletedAt: null });
    
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    
    const image = voucher.image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    // Soft delete
    voucher.deletedAt = new Date();
    await voucher.save();
    
    cache.del(CACHE_KEYS.VOUCHERS || 'vouchers');
    cache.del(`voucher_${id}`);
    
    res.json({
      success: true,
      message: 'Voucher berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getVouchers, 
  getVoucherById, 
  createVoucher, 
  updateVoucher, 
  deleteVoucher 
};