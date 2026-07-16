/**
 * Auth Middleware
 * Middleware untuk proteksi route dan verifikasi autentikasi
 */

// TODO:
// Import Firebase Admin SDK

// TODO:
// Verifikasi Firebase ID Token.

// TODO:
// Membuat Session menggunakan HttpOnly Cookie.

// TODO:
// Sinkronisasi User ke Database.

// TODO:
// Refresh Session.

// Middleware untuk verifikasi token Firebase
const authMiddleware = async (req, res, next) => {
  // TODO: Verifikasi Firebase ID Token.
  // TODO: Ambil token dari header Authorization atau cookie.
  // TODO: Decode token untuk mendapatkan user info.
  // TODO: Sinkronisasi User ke Database.
  // TODO: Attach user info ke request object.
  
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Tidak ada token, akses ditolak'
      });
    }
    
    // TODO: Verifikasi token dengan Firebase Admin
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;
    // req.user.uid = decodedToken.uid;
    
    // Placeholder - kembalikan error karena belum diimplementasi
    return res.status(501).json({
      success: false,
      message: 'Firebase Auth belum diimplementasikan'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

// Middleware untuk refresh token
const refreshTokenMiddleware = async (req, res, next) => {
  // TODO: Refresh Session.
  // TODO: Cek dan refresh token jika expired.
  
  next();
};

// Middleware untuk optional auth (tidak wajib login)
const optionalAuth = async (req, res, next) => {
  // TODO: Verifikasi Firebase ID Token jika ada.
  // TODO: Jika tidak ada token, lanjutkan tanpa user.
  
  next();
};

module.exports = {
  authMiddleware,
  refreshTokenMiddleware,
  optionalAuth
};