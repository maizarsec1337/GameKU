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

// Upload single file endpoint
const handleSingleUpload = (uploadMiddleware, storageType) => {
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
router.post('/avatar', uploadAvatar, handleSingleUpload(null, 'avatars'));

// Product image upload
router.post('/product', uploadProduct, handleSingleUpload(null, 'products'));

// Banner upload
router.post('/banner', uploadBanner, handleSingleUpload(null, 'banners'));

// Promo upload
router.post('/promo', uploadPromo, handleSingleUpload(null, 'promos'));

// Voucher upload
router.post('/voucher', uploadVoucher, handleSingleUpload(null, 'vouchers'));

// Category upload
router.post('/category', uploadCategory, handleSingleUpload(null, 'categories'));

// KTP upload
router.post('/ktp', uploadKTP, handleSingleUpload(null, 'ktp'));

// Selfie upload
router.post('/selfie', uploadSelfie, handleSingleUpload(null, 'selfie'));

// Document upload
router.post('/document', uploadDocument, handleSingleUpload(null, 'documents'));

// Chat image upload
router.post('/chat', uploadChat, handleSingleUpload(null, 'chat'));

// Review image upload
router.post('/review', uploadReview, handleSingleUpload(null, 'reviews'));

module.exports = router;