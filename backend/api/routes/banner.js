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

// Get all active banners
router.get('/', getBanners);

// Get banner by ID
router.get('/:id', getBannerById);

// Create banner with image upload
router.post('/', uploadBanner, createBanner);

// Update banner with optional image upload
router.put('/:id', uploadBanner, updateBanner);
router.patch('/:id', uploadBanner, updateBanner);

// Delete banner
router.delete('/:id', deleteBanner);

module.exports = router;