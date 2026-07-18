/**
 * Role Middleware
 * Middleware untuk pengecekan role user
 */

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Pengguna belum login.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.'
      });
    }
    
    next();
  };
};

module.exports = roleMiddleware;