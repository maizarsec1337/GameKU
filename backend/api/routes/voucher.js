const express = require('express');
const router = express.Router();
const { getVouchers, getVoucherById } = require('../controllers/voucherController');

router.get('/', getVouchers);
router.get('/:id', getVoucherById);

module.exports = router;