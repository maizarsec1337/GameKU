const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile } = require('../helpers/storageHelper');

// In-memory data store for development
let devVouchers = [
  { id: 1, code: 'GAMEKU10', discount: 10, active: true },
  { id: 2, code: 'GAMEKU20', discount: 20, active: true }
];

const getVouchers = (req, res) => {
  try {
    res.json({
      success: true,
      data: devVouchers.filter(v => v.active)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVoucherById = (req, res) => {
  try {
    const voucher = devVouchers.find(v => v.id === parseInt(req.params.id));
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    res.json({ success: true, data: voucher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVoucher = async (req, res) => {
  try {
    const { code, discount, active } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Kode voucher wajib diisi'
      });
    }
    
    // Handle file upload (optional image)
    let imagePath = '/gambar/voucher/googleplay.png'; // Default fallback
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'vouchers');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    const newVoucher = {
      id: devVouchers.length + 1,
      code,
      discount: parseInt(discount) || 0,
      image: imagePath,
      active: active !== undefined ? active : true
    };
    
    devVouchers.push(newVoucher);
    
    res.status(201).json({
      success: true,
      message: 'Voucher berhasil ditambahkan',
      data: newVoucher
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucherIndex = devVouchers.findIndex(v => v.id === parseInt(id));
    
    if (voucherIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Voucher tidak ditemukan'
      });
    }
    
    const { code, discount, active } = req.body;
    
    // Handle file upload
    if (req.file) {
      try {
        const oldImage = devVouchers[voucherIndex].image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        
        const storagePath = await saveFile(req.file, 'image', 'vouchers');
        devVouchers[voucherIndex].image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (code !== undefined) devVouchers[voucherIndex].code = code;
    if (discount !== undefined) devVouchers[voucherIndex].discount = parseInt(discount) || 0;
    if (active !== undefined) devVouchers[voucherIndex].active = active;
    
    res.json({
      success: true,
      message: 'Voucher berhasil diupdate',
      data: devVouchers[voucherIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucherIndex = devVouchers.findIndex(v => v.id === parseInt(id));
    
    if (voucherIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Voucher tidak ditemukan'
      });
    }
    
    const image = devVouchers[voucherIndex].image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    devVouchers.splice(voucherIndex, 1);
    
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