/**
 * Auth Controller
 * Controller untuk endpoint autentikasi di backend/src
 */

// TODO:
// Import authService dari services/authService

// TODO:
// Implementasi Firebase Authentication.

// TODO:
// Verifikasi Firebase ID Token.

// TODO:
// Membuat Session menggunakan HttpOnly Cookie.

// TODO:
// Sinkronisasi User ke Database.

// TODO:
// Refresh Session.

// TODO:
// Logout.

// TODO:
// Verifikasi Email.

// TODO:
// Reset Password.

// TODO:
// Google Login.

// TODO:
// Provider Login.

// Register - Mendaftarkan pengguna baru
const register = async (req, res) => {
  // TODO: Implementasi Firebase Authentication.
  // TODO: Sinkronisasi User ke Database.
  // TODO: Membuat Session menggunakan HttpOnly Cookie.
  
  try {
    const { fullName, username, phone, email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }
    
    // const result = await authService.register({ ... });
    // return res.status(result.success ? 200 : 400).json(result);
    
    res.status(501).json({
      success: false,
      message: 'Firebase Auth belum diimplementasikan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Login - Autentikasi pengguna
const login = async (req, res) => {
  // TODO: Implementasi Firebase Authentication.
  // TODO: Verifikasi Firebase ID Token.
  // TODO: Membuat Session menggunakan HttpOnly Cookie.
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }
    
    // const result = await authService.login(email, password);
    // return res.status(result.success ? 200 : 401).json(result);
    
    res.status(501).json({
      success: false,
      message: 'Firebase Auth belum diimplementasikan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Google Login - Redirect ke Google OAuth
const googleLogin = async (req, res) => {
  // TODO: Google Login.
  
  // Redirect ke halaman Google OAuth
  // res.redirect(`${process.env.FIREBASE_AUTH_URL}`);
  
  res.status(501).json({
    success: false,
    message: 'Firebase Auth belum diimplementasikan'
  });
};

// Google Callback - Handle callback dari Google OAuth
const googleCallback = async (req, res) => {
  // TODO: Google Login.
  // TODO: Verifikasi Firebase ID Token dari Google.
  // TODO: Membuat Session menggunakan HttpOnly Cookie.
  // TODO: Redirect ke frontend dengan token.
  
  res.status(501).json({
    success: false,
    message: 'Firebase Auth belum diimplementasikan'
  });
};

// Logout - Keluar dari sesi
const logout = async (req, res) => {
  // TODO: Logout.
  // TODO: Invalidate session di database.
  
  res.status(501).json({
    success: false,
    message: 'Firebase Auth belum diimplementasikan'
  });
};

// Get Me - Mendapatkan data user yang sedang login
const getMe = async (req, res) => {
  // TODO: Verifikasi Firebase ID Token.
  
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) {
  //   return res.status(401).json({ success: false, message: 'Unauthorized' });
  // }
  
  // const decoded = await firebaseAuth.verifyFirebaseToken(token);
  // const user = await authService.getMe(decoded.uid);
  
  res.status(501).json({
    success: false,
    message: 'Firebase Auth belum diimplementasikan'
  });
};

// Forgot Password - Kirim email reset password
const forgotPassword = async (req, res) => {
  // TODO: Reset Password.
  
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email wajib diisi'
      });
    }
    
    // const result = await authService.forgotPassword(email);
    
    res.status(501).json({
      success: false,
      message: 'Firebase Auth belum diimplementasikan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Reset Password - Reset password dengan token
const resetPassword = async (req, res) => {
  // TODO: Reset Password.
  
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token dan password wajib diisi'
      });
    }
    
    // const result = await authService.resetPassword(token, password);
    
    res.status(501).json({
      success: false,
      message: 'Firebase Auth belum diimplementasikan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Register Reseller
const registerReseller = async (req, res) => {
  // TODO: Sinkronisasi User ke Database.
  
  res.status(501).json({
    success: false,
    message: 'Firebase Auth belum diimplementasikan'
  });
};

// Get Reseller Status
const getResellerStatus = async (req, res) => {
  // TODO: Ambil status reseller dari database.
  
  res.status(501).json({
    success: false,
    message: 'Firebase Auth belum diimplementasikan'
  });
};

module.exports = {
  register,
  login,
  googleLogin,
  googleCallback,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  registerReseller,
  getResellerStatus
};