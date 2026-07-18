const path = require('path');
const fs = require('fs');
const { saveFile, deleteFile } = require('../helpers/storageHelper');

// In-memory data store for development
let devProducts = [
  { id: 1, name: 'Mobile Legends Diamond', price: 10000, category: 'topup', stock: 999, image: '/gambar/game/mlbb.png', status: 'active' },
  { id: 2, name: 'Free Fire Diamond', price: 10000, category: 'topup', stock: 999, image: '/gambar/game/free-fire.png', status: 'active' },
  { id: 3, name: 'Steam Wallet 50k', price: 50000, category: 'steam', stock: 50, image: '/gambar/steam/steam.jpeg', status: 'active' }
];

// Get reseller products
const getResellerProducts = async (req, res) => {
  try {
    // TODO: Filter by seller ID from auth
    res.json({
      success: true,
      data: devProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reseller product by ID
const getResellerProductById = async (req, res) => {
  try {
    const product = devProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create reseller product with image upload
const createResellerProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan harga produk wajib diisi'
      });
    }
    
    // Handle file upload
    let imagePath = '/gambar/logo/Gcard.png'; // Default fallback
    
    if (req.file) {
      try {
        const storagePath = await saveFile(req.file, 'image', 'products');
        imagePath = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    const newProduct = {
      id: devProducts.length + 1,
      name,
      price: parseInt(price),
      category: category || 'topup',
      stock: parseInt(stock) || 0,
      image: imagePath,
      status: 'active'
    };
    
    devProducts.push(newProduct);
    
    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update reseller product with optional image upload
const updateResellerProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = devProducts.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }
    
    const { name, price, category, stock, status } = req.body;
    
    // Handle file upload
    if (req.file) {
      try {
        const oldImage = devProducts[productIndex].image;
        if (oldImage && oldImage.startsWith('/storage/')) {
          await deleteFile(oldImage);
        }
        
        const storagePath = await saveFile(req.file, 'image', 'products');
        devProducts[productIndex].image = storagePath;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message
        });
      }
    }
    
    if (name !== undefined) devProducts[productIndex].name = name;
    if (price !== undefined) devProducts[productIndex].price = parseInt(price);
    if (category !== undefined) devProducts[productIndex].category = category;
    if (stock !== undefined) devProducts[productIndex].stock = parseInt(stock);
    if (status !== undefined) devProducts[productIndex].status = status;
    
    res.json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: devProducts[productIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete reseller product
const deleteResellerProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = devProducts.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }
    
    const image = devProducts[productIndex].image;
    if (image && image.startsWith('/storage/')) {
      await deleteFile(image);
    }
    
    devProducts.splice(productIndex, 1);
    
    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const productIndex = devProducts.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }
    
    devProducts[productIndex].stock = parseInt(stock) || 0;
    
    res.json({
      success: true,
      message: 'Stok berhasil diupdate',
      data: devProducts[productIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// KYC upload
const uploadKyc = async (req, res) => {
  try {
    const { ktpPhoto, selfiePhoto, document } = req.files;
    
    const result = {};
    
    if (ktpPhoto) {
      try {
        result.ktpPhoto = await saveFile(ktpPhoto, 'image', 'ktp');
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
    
    if (selfiePhoto) {
      try {
        result.selfiePhoto = await saveFile(selfiePhoto, 'image', 'selfie');
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
    
    if (document) {
      try {
        result.document = await saveFile(document, 'document', 'documents');
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
    
    res.json({
      success: true,
      message: 'Dokumen KYC berhasil diupload',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getResellerProducts, 
  getResellerProductById, 
  createResellerProduct, 
  updateResellerProduct, 
  deleteResellerProduct,
  updateStock,
  uploadKyc
};