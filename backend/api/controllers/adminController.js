/**
 * Admin Controller
 * Controller untuk halaman admin dashboard
 */

// In-memory data store untuk development

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
const devData = {
  users: [
    { id: 1, email: 'admin', name: 'Administrator', role: 'admin', status: 'active', balance: 0 },
    { id: 2, email: 'user', name: 'Regular User', role: 'user', status: 'active', balance: 50000 },
    { id: 3, email: 'reseller', name: 'Reseller User', role: 'reseller', status: 'active', balance: 100000 }
  ],
  products: [
    { id: 1, name: 'Mobile Legends Diamond', price: 10000, category: 'topup', stock: 999, status: 'active' },
    { id: 2, name: 'Free Fire Diamond', price: 10000, category: 'topup', stock: 999, status: 'active' },
    { id: 3, name: 'Steam Wallet 50k', price: 50000, category: 'steam', stock: 50, status: 'active' },
    { id: 4, name: 'Google Play Giftcard 50k', price: 50000, category: 'giftcard', stock: 100, status: 'active' }
  ],
  orders: [
    { id: 1, user_id: 2, product_id: 1, status: 'pending', amount: 10000, created_at: new Date() },
    { id: 2, user_id: 3, product_id: 3, status: 'completed', amount: 50000, created_at: new Date() }
  ],
  banners: [
    { id: 1, title: 'Promo Mobile Legends', image: '/images/banner/ml.jpg', active: true },
    { id: 2, title: 'Diskon Steam Wallet', image: '/images/banner/steam.jpg', active: true }
  ],
  categories: [
    { id: 1, name: 'Top Up', slug: 'topup', icon: '💎' },
    { id: 2, name: 'Steam Key', slug: 'steam', icon: '🎮' },
    { id: 3, name: 'Gift Card', slug: 'giftcard', icon: '🎁' }
  ],
  resellers: [
    { id: 1, name: 'Toko Reseller 1', owner: 'reseller', status: 'approved', balance: 100000 },
    { id: 2, name: 'Toko Reseller 2', owner: 'user2', status: 'pending', balance: 0 }
  ],
  vouchers: [
    { id: 1, code: 'GAMEKU10', discount: 10, active: true },
    { id: 2, code: 'GAMEKU20', discount: 20, active: true }
  ],
  promos: [
    { id: 1, title: 'Promo Tahun Baru', discount: 25, active: true },
    { id: 2, title: 'Flash Sale', discount: 50, active: true }
  ],
  withdraws: [
    { id: 1, reseller_id: 1, amount: 50000, status: 'pending', method: 'bank' },
    { id: 2, reseller_id: 1, amount: 75000, status: 'approved', method: 'ewallet' }
  ]
};

/**
 * Admin Dashboard - Statistik keseluruhan
 * @route GET /api/admin/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const stats = {
      total_users: devData.users.length,
      total_products: devData.products.length,
      total_orders: devData.orders.length,
      total_resellers: devData.resellers.length,
      revenue_today: 1500000,
      orders_pending: devData.orders.filter(o => o.status === 'pending').length,
      withdraw_pending: devData.withdraws.filter(w => w.status === 'pending').length
    };
    
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
 * User Dashboard
 * @route GET /api/admin/users
 */
const getUsers = async (req, res) => {
  try {
    res.json({
      success: true,
      data: devData.users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Reseller Dashboard
 * @route GET /api/admin/resellers
 */
const getResellers = async (req, res) => {
  try {
    res.json({
      success: true,
      data: devData.resellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Manage Banner
 * @route GET /api/admin/banners
 */
const getBanners = async (req, res) => {
  try {
    res.json({
      success: true,
      data: devData.banners
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
    const { title, image, link } = req.body;
    const newBanner = {
      id: devData.banners.length + 1,
      title,
      image,
      link,
      active: true
    };
    devData.banners.push(newBanner);
    
    res.status(201).json({
      success: true,
      message: 'Banner berhasil ditambahkan',
      data: newBanner
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
    res.json({
      success: true,
      data: devData.categories
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
    const { name, slug, icon } = req.body;
    const newCategory = {
      id: devData.categories.length + 1,
      name,
      slug,
      icon
    };
    devData.categories.push(newCategory);
    
    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: newCategory
    });
  } catch (error) {
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
    res.json({
      success: true,
      data: devData.products.filter(p => p.category === 'topup')
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
    res.json({
      success: true,
      data: devData.vouchers
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
    const { code, discount, active } = req.body;
    const newVoucher = {
      id: devData.vouchers.length + 1,
      code,
      discount,
      active: active !== undefined ? active : true
    };
    devData.vouchers.push(newVoucher);
    
    res.status(201).json({
      success: true,
      message: 'Voucher berhasil ditambahkan',
      data: newVoucher
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
    res.json({
      success: true,
      data: devData.promos
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
    const { title, discount, active } = req.body;
    const newPromo = {
      id: devData.promos.length + 1,
      title,
      discount,
      active: active !== undefined ? active : true
    };
    devData.promos.push(newPromo);
    
    res.status(201).json({
      success: true,
      message: 'Promo berhasil ditambahkan',
      data: newPromo
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
    res.json({
      success: true,
      data: devData.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create Product
 * @route POST /api/admin/products
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock, image } = req.body;
    const newProduct = {
      id: devData.products.length + 1,
      name,
      price,
      category,
      stock,
      image,
      status: 'active'
    };
    devData.products.push(newProduct);
    
    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: newProduct
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
    res.json({
      success: true,
      data: devData.orders
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
    const { status } = req.body;
    
    const orderIndex = devData.orders.findIndex(o => o.id === parseInt(id));
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    
    devData.orders[orderIndex].status = status;
    
    res.json({
      success: true,
      message: 'Status pesanan berhasil diupdate',
      data: devData.orders[orderIndex]
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
    res.json({
      success: true,
      data: devData.withdraws
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
    
    const withdrawIndex = devData.withdraws.findIndex(w => w.id === parseInt(id));
    if (withdrawIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Withdraw tidak ditemukan'
      });
    }
    
    devData.withdraws[withdrawIndex].status = status;
    
    res.json({
      success: true,
      message: 'Status withdraw berhasil diupdate',
      data: devData.withdraws[withdrawIndex]
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
};