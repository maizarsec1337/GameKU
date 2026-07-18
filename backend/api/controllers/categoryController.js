const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile } = require('../helpers/storageHelper');

// In-memory data store for development
let devCategories = [
  { id: 1, name: 'Top Up', slug: 'topup', icon: '💎', image: '/gambar/game/mlbb.png' },
  { id: 2, name: 'Steam Key', slug: 'steam', icon: '🎮', image: '/gambar/steam/steam.jpeg' },
  { id: 3, name: 'Gift Card', slug: 'giftcard', icon: '🎁', image: '/gambar/giftcard/googleplay.png' }
];

const getCategories = (req, res) => {
  try {
    res.json({
      success: true,
      data: devCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = (req, res) => {
  try {
    const category = devCategories.find(c => c.id === parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan slug kategori wajib diisi'
      });
    }
    
    // Handle file upload
    let imagePath = '/gambar/game/mlbb.png'; // Default fallback
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'categories');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    const newCategory = {
      id: devCategories.length + 1,
      name,
      slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''),
      icon: icon || '📦',
      image: imagePath
    };
    
    devCategories.push(newCategory);
    
    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = devCategories.findIndex(c => c.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }
    
    const { name, slug, icon } = req.body;
    
    // Handle file upload
    if (req.file) {
      try {
        const oldImage = devCategories[categoryIndex].image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        
        const storagePath = await saveFile(req.file, 'image', 'categories');
        devCategories[categoryIndex].image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (name !== undefined) devCategories[categoryIndex].name = name;
    if (slug !== undefined) devCategories[categoryIndex].slug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    if (icon !== undefined) devCategories[categoryIndex].icon = icon;
    
    res.json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: devCategories[categoryIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = devCategories.findIndex(c => c.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }
    
    const image = devCategories[categoryIndex].image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    devCategories.splice(categoryIndex, 1);
    
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