const express = require('express');
const router = express.Router();
const { 
  getResellerProducts, 
  getResellerProductById, 
  createResellerProduct, 
  updateResellerProduct, 
  deleteResellerProduct,
  updateStock,
  uploadKyc,
  registerReseller,
  getResellerStatus,
  getResellerProfile
} = require('../controllers/resellerController');
const { uploadKYC, uploadProduct, uploadKTP, uploadSelfie, uploadStoreLogo } = require('../middleware/uploadMiddleware');
const { authMiddleware, roleMiddleware } = require('../middleware');

// User registration routes (public)
router.post('/register', registerReseller);
router.get('/status', getResellerStatus);
router.get('/profile', getResellerProfile);

// Products - require reseller role
router.get('/products', authMiddleware, roleMiddleware('reseller'), getResellerProducts);
router.get('/products/:id', authMiddleware, roleMiddleware('reseller'), getResellerProductById);
router.post('/products', authMiddleware, roleMiddleware('reseller'), uploadProduct, createResellerProduct);
router.put('/products/:id', authMiddleware, roleMiddleware('reseller'), uploadProduct, updateResellerProduct);
router.patch('/products/:id', authMiddleware, roleMiddleware('reseller'), uploadProduct, updateResellerProduct);
router.delete('/products/:id', authMiddleware, roleMiddleware('reseller'), deleteResellerProduct);

// Stock
router.put('/products/:id/stock', authMiddleware, roleMiddleware('reseller'), updateStock);

// KYC upload (legacy)
router.post('/kyc', authMiddleware, roleMiddleware('reseller'), uploadKYC, uploadKyc);

module.exports = router;