const express = require('express');
const router = express.Router();
const { getBanners, getBannerById } = require('../controllers/bannerController');

router.get('/', getBanners);
router.get('/:id', getBannerById);

module.exports = router;