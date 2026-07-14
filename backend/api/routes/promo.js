const express = require('express');
const router = express.Router();
const { getPromos } = require('../controllers/promoController');

router.get('/', getPromos);

module.exports = router;