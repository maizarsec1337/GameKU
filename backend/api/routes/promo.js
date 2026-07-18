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

// Get all active promos
router.get('/', getPromos);

// Get promo by ID
router.get('/:id', getPromoById);

// Create promo with image upload
router.post('/', uploadPromo, createPromo);

// Update promo with optional image upload
router.put('/:id', uploadPromo, updatePromo);
router.patch('/:id', uploadPromo, updatePromo);

// Delete promo
router.delete('/:id', deletePromo);

module.exports = router;