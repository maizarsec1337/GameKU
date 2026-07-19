const express = require('express');
const router = express.Router();
const { 
  uploadAvatar, 
  uploadProduct, 
  uploadBanner, 
  uploadPromo, 
  uploadVoucher,
  uploadCategory,
  uploadKTP,
  uploadSelfie,
  uploadDocument,
  uploadChat,
  uploadReview,
  uploadGame
} = require('../middleware/uploadMiddleware');
const { saveFile } = require('../helpers/storageHelper');

// Upload single file endpoint - accepts storageType from closure
const handleSingleUpload = (storageType) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Tidak ada file yang diupload'
        });
      }
      
      // Map storage types to match STORAGE_DIRS keys
      const storageTypeMap = {
        'avatars': 'profile',
        'products': 'product', 
        'banners': 'banner',
        'promos': 'promo',
        'vouchers': 'voucher',
        'categories': 'category',
        'reviews': 'review',
        'ktp': 'ktp',
        'selfie': 'selfie',
        'chat': 'chat',
        'documents': 'documents',
        'games': 'games'
      };
      
      const mappedType = storageTypeMap[storageType] || storageType;
      const storagePath = await saveFile(req.file, 'image', mappedType);
      
      res.json({
        success: true,
        message: 'File berhasil diupload',
        data: {
          url: storagePath,
          filename: req.file.filename
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
};

// Avatar upload - maps to profile directory
router.post('/avatar', uploadAvatar, handleSingleUpload('avatars'));

// Product image upload - maps to product directory
router.post('/product', uploadProduct, handleSingleUpload('products'));

// Banner upload - maps to banner directory
router.post('/banner', uploadBanner, handleSingleUpload('banners'));

// Promo upload - maps to promo directory
router.post('/promo', uploadPromo, handleSingleUpload('promos'));

// Voucher upload - maps to voucher directory
router.post('/voucher', uploadVoucher, handleSingleUpload('vouchers'));

// Category upload - maps to category directory
router.post('/category', uploadCategory, handleSingleUpload('categories'));

// KTP upload - maps to ktp directory
router.post('/ktp', uploadKTP, handleSingleUpload('ktp'));

// Selfie upload - maps to selfie directory
router.post('/selfie', uploadSelfie, handleSingleUpload('selfie'));

// Document upload - maps to documents directory
router.post('/document', uploadDocument, handleSingleUpload('documents'));

// Chat image upload - maps to chat directory
router.post('/chat', uploadChat, handleSingleUpload('chat'));

// Review image upload - maps to review directory
router.post('/review', uploadReview, handleSingleUpload('reviews'));

// Game upload - maps to games directory
router.post('/game', uploadGame, handleSingleUpload('games'));

module.exports = router;