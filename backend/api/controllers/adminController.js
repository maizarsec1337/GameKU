/**
 * Admin Controller
 * Controller untuk halaman admin dashboard
 */

// Security logging helper
const logAdminAction = (req, action, details = {}) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'ADMIN_ACTION',
    action,
    adminId: req.user?.uid || req.user?.email,
    ip: req.ip,
    path: req.path,
    ...details
  }));
};

// Sanitize input helper
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

/**
 * Admin Dashboard - Statistik keseluruhan
 * @route GET /api/admin/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const stats = {
      total_users: 0,
      total_products: 0,
      total_orders: 0,
      total_resellers: 0,
      revenue_today: 0,
      orders_pending: 0,
      withdraw_pending: 0
    };
    
    // Try to get real stats from database
    try {
      const { User, Product, Order, Reseller } = require('../../models');
      if (User) stats.total_users = await User.countDocuments().catch(() => 0);
      if (Product) stats.total_products = await Product.countDocuments({ deletedAt: null }).catch(() => 0);
      if (Order) stats.total_orders = await Order.countDocuments().catch(() => 0);
      if (Reseller) stats.total_resellers = await Reseller.countDocuments().catch(() => 0);
      
      if (Order) {
        const pendingOrders = await Order.countDocuments({ status: 'pending' }).catch(() => 0);
        stats.orders_pending = pendingOrders;
      }
    } catch (dbError) {
      console.warn('Database stats error:', dbError.message);
    }
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * User Management
 * @route GET /api/admin/users
 */
const getUsers = async (req, res) => {
  try {
    const { User } = require('../../models');
    let users = [];
    if (User) {
      users = await User.find().select('email fullName role status balance').lean().catch(() => []);
    }
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all reseller applications with full data for admin verification
const getResellerApplications = async (req, res) => {
  try {
    const { Reseller } = require('../../models');
    let resellers = [];
    if (Reseller) {
      resellers = await Reseller.find().lean().catch(() => []);
    }
    res.json({
      success: true,
      data: resellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify reseller application (admin only)
const verifyResellerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;
    const adminId = req.user?.uid || req.user?.email;

    logAdminAction(req, 'RESELLER_VERIFY', {
      action,
      targetId: id,
      adminId
    });

    const { Reseller, User } = require('../../models');
    
    if (Reseller) {
      const reseller = await Reseller.findById(id);
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Permohonan reseller tidak ditemukan'
        });
      }

      if (action === 'approve') {
        reseller.verificationStatus = 'approved';
        // Update user role to reseller
        if (User) {
          await User.findOneAndUpdate(
            { uid: reseller.userId },
            { role: 'reseller', 'resellerInfo.resellerStatus': 'approved' }
          ).catch(() => {});
        }
      } else if (action === 'reject') {
        reseller.verificationStatus = 'rejected';
        reseller.rejectionReason = sanitizeInput(rejectionReason || 'Tidak memenuhi syarat');
        // Update user role back to user
        if (User) {
          await User.findOneAndUpdate(
            { uid: reseller.userId },
            { role: 'user', 'resellerInfo.resellerStatus': 'rejected' }
          ).catch(() => {});
        }
      } else if (action === 'suspend') {
        reseller.verificationStatus = 'suspended';
      }

      await reseller.save();

      return res.json({
        success: true,
        message: `Reseller berhasil ${action === 'approve' ? 'disetujui' : action === 'reject' ? 'ditolak' : 'ditangguhkan'}`,
        data: reseller
      });
    }

    res.json({
      success: true,
      message: `Reseller berhasil ${action === 'approve' ? 'disetujui' : action === 'reject' ? 'ditolak' : 'ditangguhkan'}`
    });
  } catch (error) {
    console.error('Verify reseller error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memverifikasi reseller'
    });
  }
};

/**
 * Manage Banner
 * @route GET /api/admin/banners
 */
const getBanners = async (req, res) => {
  try {
    const { Banner } = require('../../models');
    let banners = [];
    if (Banner) {
      banners = await Banner.find({ deletedAt: null }).sort({ order: 1 }).lean().catch(() => []);
    }
    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create Banner
 * @route POST /api/admin/banners
 */
const createBanner = async (req, res) => {
  try {
    const { Banner } = require('../../models');
    const { title, image, link, order } = req.body;
    
    if (Banner) {
      const banner = new Banner({
        title: sanitizeInput(title || ''),
        image: image || '/gambar/banner/default.jpg',
        link: sanitizeInput(link || ''),
        order: parseInt(order) || 0
      });
      await banner.save();
      return res.status(201).json({
        success: true,
        message: 'Banner berhasil ditambahkan',
        data: banner
      });
    }

    res.status(201).json({
      success: true,
      message: 'Banner berhasil ditambahkan (simulasi)',
      data: { title, image, link, order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Category
 * @route GET /api/admin/categories
 */
const getCategories = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    let categories = [];
    if (ProductCategory) {
      categories = await ProductCategory.find({ deletedAt: null }).lean().catch(() => []);
    }
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create Category
 * @route POST /api/admin/categories
 */
const createCategory = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    const { name, slug, icon, categoryType } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan slug wajib diisi'
      });
    }
    
    if (ProductCategory) {
      const category = new ProductCategory({
        name: sanitizeInput(name),
        slug: sanitizeInput(slug),
        icon: icon || '📦',
        categoryType: categoryType || 'topup'
      });
      await category.save();
      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil ditambahkan',
        data: category
      });
    }

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan (simulasi)',
      data: { name, slug, icon }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug sudah digunakan'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Game
 * @route GET /api/admin/games
 */
const getGames = async (req, res) => {
  try {
    const { ProductCategory } = require('../../models');
    let games = [];
    if (ProductCategory) {
      games = await ProductCategory.find({ categoryType: 'game', deletedAt: null }).lean().catch(() => []);
    }
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Voucher
 * @route GET /api/admin/vouchers
 */
const getVouchers = async (req, res) => {
  try {
    const { Voucher } = require('../../models');
    let vouchers = [];
    if (Voucher) {
      vouchers = await Voucher.find({ deletedAt: null }).lean().catch(() => []);
    }
    res.json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create Voucher
 * @route POST /api/admin/vouchers
 */
const createVoucher = async (req, res) => {
  try {
    const { Voucher } = require('../../models');
    const { code, discount, active, minPurchase, maxDiscount, expiredAt, limitPerUser, limitTotal } = req.body;
    
    if (Voucher) {
      const voucher = new Voucher({
        code: sanitizeInput(code || ''),
        discount: parseInt(discount) || 0,
        minPurchase: parseInt(minPurchase) || 0,
        maxDiscount: parseInt(maxDiscount) || null,
        active: active !== undefined ? active : true,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        limitPerUser: parseInt(limitPerUser) || 1,
        limitTotal: parseInt(limitTotal) || null
      });
      await voucher.save();
      return res.status(201).json({
        success: true,
        message: 'Voucher berhasil ditambahkan',
        data: voucher
      });
    }

    res.status(201).json({
      success: true,
      message: 'Voucher berhasil ditambahkan (simulasi)',
      data: { code, discount, active }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Promo
 * @route GET /api/admin/promos
 */
const getPromos = async (req, res) => {
  try {
    const { Promo } = require('../../models');
    let promos = [];
    if (Promo) {
      promos = await Promo.find({ deletedAt: null }).lean().catch(() => []);
    }
    res.json({
      success: true,
      data: promos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create Promo
 * @route POST /api/admin/promos
 */
const createPromo = async (req, res) => {
  try {
    const { Promo } = require('../../models');
    const { title, discount, active, description, bannerImage, expiredAt, productIds } = req.body;
    
    if (Promo) {
      const promo = new Promo({
        title: sanitizeInput(title || ''),
        discount: parseInt(discount) || 0,
        description: sanitizeInput(description || ''),
        bannerImage: bannerImage || '',
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        productIds: Array.isArray(productIds) ? productIds : [],
        active: active !== undefined ? active : true
      });
      await promo.save();
      return res.status(201).json({
        success: true,
        message: 'Promo berhasil ditambahkan',
        data: promo
      });
    }

    res.status(201).json({
      success: true,
      message: 'Promo berhasil ditambahkan (simulasi)',
      data: { title, discount, active }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Products
 * @route GET /api/admin/products
 */
const getProducts = async (req, res) => {
  try {
    const { Product } = require('../../models');
    let products = [];
    if (Product) {
      products = await Product.find({ deletedAt: null })
        .select('name price stock status sellerId createdAt')
        .populate('categoryId', 'name')
        .lean()
        .catch(() => []);
    }
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Order Status
 * @route PUT /api/admin/orders/:id
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentProof } = req.body;
    
    const { Order } = require('../../models');
    if (Order) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pesanan tidak ditemukan'
        });
      }
      
      order.status = status;
      if (paymentProof) {
        order.paymentProof = paymentProof;
      }
      await order.save();
      
      return res.json({
        success: true,
        message: 'Status pesanan berhasil diupdate',
        data: order
      });
    }

    res.json({
      success: true,
      message: 'Status pesanan berhasil diupdate (simulasi)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Orders
 * @route GET /api/admin/orders
 */
const getOrders = async (req, res) => {
  try {
    const { Order } = require('../../models');
    let orders = [];
    if (Order) {
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'fullName email')
        .lean()
        .catch(() => []);
    }
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Withdraws
 * @route GET /api/admin/withdraws
 */
const getWithdraws = async (req, res) => {
  try {
    // Placeholder for withdrawals - no model exists
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Withdraw Status
 * @route PUT /api/admin/withdraws/:id
 */
const updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Placeholder for withdrawals - no model exists
    res.json({
      success: true,
      message: 'Status withdraw berhasil diupdate (simulasi)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
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
  createProduct: () => {},
  getOrders,
  updateOrderStatus,
  getWithdraws,
  updateWithdrawStatus
};