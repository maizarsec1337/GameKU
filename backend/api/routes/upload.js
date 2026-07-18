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
  uploadReview
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
      
      const storagePath = await saveFile(req.file, 'image', storageType);
      
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

// Avatar upload
router.post('/avatar', uploadAvatar, handleSingleUpload('avatars'));

// Product image upload
router.post('/product', uploadProduct, handleSingleUpload('products'));

// Banner upload
router.post('/banner', uploadBanner, handleSingleUpload('banners'));

// Promo upload
router.post('/promo', uploadPromo, handleSingleUpload('promos'));

// Voucher upload
router.post('/voucher', uploadVoucher, handleSingleUpload('vouchers'));

// Category upload
router.post('/category', uploadCategory, handleSingleUpload('categories'));

// KTP upload
router.post('/ktp', uploadKTP, handleSingleUpload('ktp'));

// Selfie upload
router.post('/selfie', uploadSelfie, handleSingleUpload('selfie'));

// Document upload
router.post('/document', uploadDocument, handleSingleUpload('documents'));

// Chat image upload
router.post('/chat', uploadChat, handleSingleUpload('chat'));

// Review image upload
router.post('/review', uploadReview, handleSingleUpload('reviews'));

module.exports = router;
