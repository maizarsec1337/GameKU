const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { uploadCategory } = require('../middleware/uploadMiddleware');
const { authMiddleware, roleMiddleware } = require('../middleware');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), uploadCategory, createCategory);
router.put('/:id', authMiddleware, roleMiddleware('admin'), uploadCategory, updateCategory);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), uploadCategory, updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCategory);

module.exports = router;