const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile, STORAGE_BASE } = require('../helpers/storageHelper');

// In-memory data store for development
let devBanners = [
  { id: 1, title: 'Promo Mobile Legends', image: '/gambar/banner/hero1.png', link: '/category/topup', active: true },
  { id: 2, title: 'Diskon Steam Wallet', image: '/gambar/banner/hero2.png', link: '/category/steam', active: true }
];

const getBanners = (req, res) => {
  try {
    res.json({
      success: true,
      data: devBanners.filter(b => b.active)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBannerById = (req, res) => {
  try {
    const banner = devBanners.find(b => b.id === parseInt(req.params.id));
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
    }
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, link } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul banner wajib diisi'
      });
    }
    
    // Handle file upload
    let imagePath = '/gambar/banner/hero1.png'; // Default fallback
    
    if (req.file) {
      try {
        // Save file to storage
        const storagePath = await saveFile(req.file, 'image', 'banners');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    const newBanner = {
      id: devBanners.length + 1,
      title,
      image: imagePath,
      link: link || '/',
      active: true
    };
    
    devBanners.push(newBanner);
    
    res.status(201).json({
      success: true,
      message: 'Banner berhasil ditambahkan',
      data: newBanner
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerIndex = devBanners.findIndex(b => b.id === parseInt(id));
    
    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Banner tidak ditemukan'
      });
    }
    
    const { title, link, active } = req.body;
    
    // Handle file upload for new image
    if (req.file) {
      try {
        // Delete old image if not default
        const oldImage = devBanners[bannerIndex].image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        
        // Save new file
        const storagePath = await saveFile(req.file, 'image', 'banners');
        devBanners[bannerIndex].image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    // Update other fields
    if (title !== undefined) devBanners[bannerIndex].title = title;
    if (link !== undefined) devBanners[bannerIndex].link = link;
    if (active !== undefined) devBanners[bannerIndex].active = active;
    
    res.json({
      success: true,
      message: 'Banner berhasil diupdate',
      data: devBanners[bannerIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerIndex = devBanners.findIndex(b => b.id === parseInt(id));
    
    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Banner tidak ditemukan'
      });
    }
    
    // Delete image file
    const image = devBanners[bannerIndex].image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    devBanners.splice(bannerIndex, 1);
    
    res.json({
      success: true,
      message: 'Banner berhasil dihapus'
    });
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