const express = require('express');
const router = express.Router();
const { search, searchSuggestions, getPopularSearches } = require('../controllers/searchController');

// Public routes
router.get('/', search);
router.get('/suggestions', searchSuggestions);
router.get('/popular', getPopularSearches);

module.exports = router;