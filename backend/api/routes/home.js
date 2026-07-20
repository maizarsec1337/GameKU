const express = require('express');
const router = express.Router();
const { 
  getHomeData, 
  getProductsByCategory,
  getProductDetail 
} = require('../controllers/homeController');
const { authMiddleware, roleMiddleware } = require('../middleware');

// Public routes
router.get('/', getHomeData);
router.get('/category/:categoryType', getProductsByCategory);

// Product detail route - accepts both ID and slug
router.get('/product/:id', getProductDetail);

// Admin route for cache invalidation
router.post('/cache/clear', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const { cache } = require('../services/cacheService');
  cache.clearAll();
  res.json({ success: true, message: 'Cache berhasil dibersihkan' });
});

module.exports = router;