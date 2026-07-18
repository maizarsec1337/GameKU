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

// Get all categories
router.get('/', getCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Create category with image upload
router.post('/', uploadCategory, createCategory);

// Update category with optional image upload
router.put('/:id', uploadCategory, updateCategory);
router.patch('/:id', uploadCategory, updateCategory);

// Delete category
router.delete('/:id', deleteCategory);

module.exports = router;