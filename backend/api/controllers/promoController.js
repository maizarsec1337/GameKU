const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile } = require('../helpers/storageHelper');

// In-memory data store for development
let devPromos = [
  { id: 1, title: 'Promo Tahun Baru', image: '/gambar/promo/flashsale.png', discount: 25, active: true },
  { id: 2, title: 'Flash Sale', image: '/gambar/promo/bonus.png', discount: 50, active: true }
];

const getPromos = (req, res) => {
  try {
    res.json({
      success: true,
      data: devPromos.filter(p => p.active)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPromoById = (req, res) => {
  try {
    const promo = devPromos.find(p => p.id === parseInt(req.params.id));
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan' });
    }
    res.json({ success: true, data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPromo = async (req, res) => {
  try {
    const { title, discount } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul promo wajib diisi'
      });
    }
    
    // Handle file upload
    let imagePath = '/gambar/promo/flashsale.png'; // Default fallback
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'promos');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    const newPromo = {
      id: devPromos.length + 1,
      title,
      image: imagePath,
      discount: parseInt(discount) || 0,
      active: true
    };
    
    devPromos.push(newPromo);
    
    res.status(201).json({
      success: true,
      message: 'Promo berhasil ditambahkan',
      data: newPromo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const promoIndex = devPromos.findIndex(p => p.id === parseInt(id));
    
    if (promoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Promo tidak ditemukan'
      });
    }
    
    const { title, discount, active } = req.body;
    
    // Handle file upload
    if (req.file) {
      try {
        const oldImage = devPromos[promoIndex].image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        
        const storagePath = await saveFile(req.file, 'image', 'promos');
        devPromos[promoIndex].image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (title !== undefined) devPromos[promoIndex].title = title;
    if (discount !== undefined) devPromos[promoIndex].discount = parseInt(discount) || 0;
    if (active !== undefined) devPromos[promoIndex].active = active;
    
    res.json({
      success: true,
      message: 'Promo berhasil diupdate',
      data: devPromos[promoIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const promoIndex = devPromos.findIndex(p => p.id === parseInt(id));
    
    if (promoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Promo tidak ditemukan'
      });
    }
    
    const image = devPromos[promoIndex].image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    devPromos.splice(promoIndex, 1);
    
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