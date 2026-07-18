const express = require('express');
const router = express.Router();
const { 
  getResellerProducts, 
  getResellerProductById, 
  createResellerProduct, 
  updateResellerProduct, 
  deleteResellerProduct,
  updateStock,
  uploadKyc
} = require('../controllers/resellerController');
const { uploadProduct, uploadKTP, uploadSelfie, uploadDocument } = require('../middleware/uploadMiddleware');
const multer = require('multer');

// Configure multer for multiple file uploads
const uploadKycFields = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = file.fieldname === 'ktpPhoto' ? 'ktp' : 
                   file.fieldname === 'selfiePhoto' ? 'selfie' : 'documents';
      cb(null, require('path').join(__dirname, '..', '..', 'storage', dest));
    },
    filename: (req, file, cb) => {
      const crypto = require('crypto');
      const ext = require('path').extname(file.originalname).toLowerCase();
      cb(null, crypto.randomBytes(16).toString('hex') + Date.now() + ext);
    }
  })
}).fields([
  { name: 'ktpPhoto', maxCount: 1 },
  { name: 'selfiePhoto', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]);

// Products
router.get('/products', getResellerProducts);
router.get('/products/:id', getResellerProductById);
router.post('/products', uploadProduct, createResellerProduct);
router.put('/products/:id', uploadProduct, updateResellerProduct);
router.patch('/products/:id', uploadProduct, updateResellerProduct);
router.delete('/products/:id', deleteResellerProduct);

// Stock
router.put('/products/:id/stock', updateStock);

// KYC upload
router.post('/kyc', uploadKycFields, uploadKyc);

module.exports = router;