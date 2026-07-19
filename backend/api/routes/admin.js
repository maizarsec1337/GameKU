/**
 * Admin Routes
 * Route untuk halaman admin dashboard
 */

const express = require('express');
const router = express.Router();
const { 
  getDashboard,
  getUsers,
  getResellerApplications,
  verifyResellerApplication,
  getBanners,
  createBanner,
  getCategories,
  createCategory,
  getGames,
  getVouchers,
  createVoucher,
  getPromos,
  createPromo,
  getProducts,
  createProduct,
  getOrders,
  updateOrderStatus,
  getWithdraws,
  updateWithdrawStatus
} = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware');
const { uploadBanner, uploadVoucher, uploadPromo, uploadCategory } = require('../middleware/uploadMiddleware');

// Apply auth middleware untuk semua route admin
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// User Management
router.get('/users', getUsers);

// Reseller Management
router.get('/resellers', getResellerApplications);
router.put('/resellers/:id/verify', verifyResellerApplication);

// Banner Management - with upload middleware
router.get('/banners', getBanners);
router.post('/banners', uploadBanner, createBanner);

// Category Management - with upload middleware
router.get('/categories', getCategories);
router.post('/categories', uploadCategory, createCategory);

// Game Management
router.get('/games', getGames);

// Voucher Management - with upload middleware
router.get('/vouchers', getVouchers);
router.post('/vouchers', uploadVoucher, createVoucher);

// Promo Management - with upload middleware
router.get('/promos', getPromos);
router.post('/promos', uploadPromo, createPromo);

// Product Management
router.get('/products', getProducts);
router.post('/products', createProduct);

// Order Management
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);

// Withdraw Management
router.get('/withdraws', getWithdraws);
router.put('/withdraws/:id', updateWithdrawStatus);

module.exports = router;
