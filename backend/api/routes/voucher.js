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
const { authMiddleware, roleMiddleware } = require('../middleware');

// Public routes
router.get('/', getVouchers);
router.get('/:id', getVoucherById);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), uploadVoucher, createVoucher);
router.put('/:id', authMiddleware, roleMiddleware('admin'), uploadVoucher, updateVoucher);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), uploadVoucher, updateVoucher);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteVoucher);

module.exports = router;