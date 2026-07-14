const express = require('express');
const router = express.Router();
const { search, searchSuggestions } = require('../controllers/searchController');

router.get('/', search);
router.get('/suggestions', searchSuggestions);

module.exports = router;