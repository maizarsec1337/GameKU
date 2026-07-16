/**
 * Role-based Middleware
 * Middleware untuk proteksi route berdasarkan role user
 */

// TODO:
// Middleware Role.

// Middleware untuk role admin
const adminOnly = (req, res, next) => {
  // TODO: Middleware Admin.
  // TODO: Cek apakah user memiliki role admin atau super_admin.
  // req.user.role should be 'admin' or 'super_admin'
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Silakan login terlebih dahulu'
    });
  }
  
  // TODO: Implementasi pengecekan role admin
  // if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Forbidden - Hanya admin yang diizinkan'
  //   });
  // }
  
  next();
};

// Middleware untuk role user biasa
const userOnly = (req, res, next) => {
  // TODO: Middleware User.
  // TODO: Cek apakah user memiliki role user.
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Silakan login terlebih dahulu'
    });
  }
  
  // TODO: Implementasi pengecekan role user
  // if (req.user.role !== 'user') {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Forbidden - Hanya user biasa yang diizinkan'
  //   });
  // }
  
  next();
};

// Middleware untuk role reseller
const resellerOnly = (req, res, next) => {
  // TODO: Middleware Seller.
  // TODO: Cek apakah user memiliki role reseller.
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Silakan login terlebih dahulu'
    });
  }
  
  // TODO: Implementasi pengecekan role reseller
  // if (req.user.role !== 'reseller') {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Forbidden - Hanya reseller yang diizinkan'
  //   });
  // }
  
  next();
};

// Middleware untuk role super admin
const superAdminOnly = (req, res, next) => {
  // TODO: Middleware Super Admin.
  // TODO: Cek apakah user memiliki role super_admin.
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Silakan login terlebih dahulu'
    });
  }
  
  // TODO: Implementasi pengecekan role super_admin
  // if (req.user.role !== 'super_admin') {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Forbidden - Hanya super admin yang diizinkan'
  //   });
  // }
  
  next();
};

// Middleware untuk role yang diizinkan (admin, reseller, user)
const requireRole = (allowedRoles) => {
  // TODO: Middleware Role.
  // TODO: Cek apakah user memiliki salah satu role yang diizinkan.
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Silakan login terlebih dahulu'
      });
    }
    
    // TODO: Implementasi pengecekan role
    // if (!allowedRoles.includes(req.user.role)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Forbidden - Anda tidak memiliki akses ke resource ini'
    //   });
    // }
    
    next();
  };
};

module.exports = {
  adminOnly,
  userOnly,
  resellerOnly,
  superAdminOnly,
  requireRole
};