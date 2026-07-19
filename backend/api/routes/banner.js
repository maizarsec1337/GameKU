const express = require('express');
const router = express.Router();
const { 
  getBanners, 
  getBannerById, 
  createBanner, 
  updateBanner, 
  deleteBanner 
} = require('../controllers/bannerController');
const { uploadBanner } = require('../middleware/uploadMiddleware');
const { authMiddleware, roleMiddleware } = require('../middleware');

// Public routes
router.get('/', getBanners);
router.get('/:id', getBannerById);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), uploadBanner, createBanner);
router.put('/:id', authMiddleware, roleMiddleware('admin'), uploadBanner, updateBanner);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), uploadBanner, updateBanner);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteBanner);

module.exports = router;
