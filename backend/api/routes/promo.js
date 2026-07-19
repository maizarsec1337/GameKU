const express = require('express');
const router = express.Router();
const { 
  getPromos, 
  getPromoById, 
  createPromo, 
  updatePromo, 
  deletePromo 
} = require('../controllers/promoController');
const { uploadPromo } = require('../middleware/uploadMiddleware');
const { authMiddleware, roleMiddleware } = require('../middleware');

// Public routes
router.get('/', getPromos);
router.get('/:id', getPromoById);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), uploadPromo, createPromo);
router.put('/:id', authMiddleware, roleMiddleware('admin'), uploadPromo, updatePromo);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), uploadPromo, updatePromo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deletePromo);

module.exports = router;