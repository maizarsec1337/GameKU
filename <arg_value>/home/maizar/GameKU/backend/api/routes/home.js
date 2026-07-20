const express = require('express');
const router = express.Router();
const { getHomeData, getProductsByCategory, invalidateCache } = require('../controllers/homeController');
const { authMiddleware, roleMiddleware } = require('../middleware');

// Get all home data (categories, sections, banners, promos)
router.get('/', getHomeData);

// Get products by category
router.get('/category/:categoryType', getProductsByCategory);

// Invalidate cache (admin only)
router.post('/invalidate-cache', authMiddleware, roleMiddleware('admin'), invalidateCache);

module.exports = router;