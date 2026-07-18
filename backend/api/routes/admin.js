/**
 * Admin Routes
 * Route untuk halaman admin dashboard
 */

const express = require('express');
const router = express.Router();
const { 
  getDashboard,
  getUsers,
  getResellers,
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

// Apply auth middleware untuk semua route admin
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// User Management
router.get('/users', getUsers);

// Reseller Management
router.get('/resellers', getResellers);

// Banner Management
router.get('/banners', getBanners);
router.post('/banners', createBanner);

// Category Management
router.get('/categories', getCategories);
router.post('/categories', createCategory);

// Game Management
router.get('/games', getGames);

// Voucher Management
router.get('/vouchers', getVouchers);
router.post('/vouchers', createVoucher);

// Promo Management
router.get('/promos', getPromos);
router.post('/promos', createPromo);

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