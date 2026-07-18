const express = require('express');
const router = express.Router();
const { 
  getVouchers, 
  getVoucherById, 
  createVoucher, 
  updateVoucher, 
  deleteVoucher 
} = require('../controllers/voucherController');
const { uploadVoucher } = require('../middleware/uploadMiddleware');

// Get all active vouchers
router.get('/', getVouchers);

// Get voucher by ID
router.get('/:id', getVoucherById);

// Create voucher with optional image upload
router.post('/', uploadVoucher, createVoucher);

// Update voucher with optional image upload
router.put('/:id', uploadVoucher, updateVoucher);
router.patch('/:id', uploadVoucher, updateVoucher);

// Delete voucher
router.delete('/:id', deleteVoucher);

module.exports = router;