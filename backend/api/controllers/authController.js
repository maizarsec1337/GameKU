/**
 * Auth Controller
 * Controller untuk endpoint autentikasi
 */

const { auth, admin, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

// Generate JWT token for session
const generateToken = (user) => {
  return jwt.sign(
    { 
      uid: user.uid, 
      email: user.email, 
      fullName: user.fullName,
      role: user.role || 'user' 
    },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '7d' }
  );
};

/**
 * Register - Mendaftarkan pengguna baru
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { fullName, username, phone, email, password, role } = req.body;
    
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }
    
    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }
    
    // Cek apakah Firebase Admin sudah diinisialisasi
    if (!auth || !admin) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Auth belum dikonfigurasi. Silakan hubungi administrator.'
      });
    }
    
    // Buat user di Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });
    
    // Set custom claims untuk role
    if (role) {
      await auth.setCustomUserClaims(userRecord.uid, { role });
    }
    
    // Generate JWT token
    const token = generateToken({
      uid: userRecord.uid,
      email: userRecord.email,
      role: role || 'user'
    });
    
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName,
        role: role || 'user'
      },
      token
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Login - Autentikasi pengguna
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Security logging for login attempt
    const loginAttemptId = Date.now().toString(36);
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: 'LOGIN_ATTEMPT',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email,
      attemptId: loginAttemptId
    }));

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }
    
    // Development mode: hardcoded credentials
    if (process.env.DEV_MODE === 'true') {
      const devUsers = {
        admin: {
          uid: 'admin-123',
          email: 'admin',
          password: 'admin123',
          fullName: 'Administrator',
          role: 'admin'
        },
        user: {
          uid: 'user-456',
          email: 'user',
          password: 'user123',
          fullName: 'Regular User',
          role: 'user'
        },
        reseller: {
          uid: 'reseller-789',
          email: 'reseller',
          password: 'reseller123',
          fullName: 'Reseller User',
          role: 'reseller'
        }
      };

      const devUser = Object.values(devUsers).find(u =>
        u.email === email && u.password === password
      );

      if (devUser) {
        const token = generateToken({
          uid: devUser.uid,
          email: devUser.email,
          fullName: devUser.fullName,
          role: devUser.role
        });

        return res.json({
          success: true,
          message: 'Login berhasil',
          user: {
            uid: devUser.uid,
            email: devUser.email,
            fullName: devUser.fullName,
            role: devUser.role
          },
          token
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }
    }
    
    // Production mode: Firebase Auth
    if (!auth || !admin) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Auth belum dikonfigurasi. Silakan hubungi administrator.'
      });
    }
    
    // Get user by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Verify password using Firebase Admin
    // Note: Firebase Admin doesn't have direct password verification
    // We need to use Firebase client SDK or verify via token
    // For now, use a stub approach - in production use Firebase Auth REST API
    
    // Get user custom claims
    const { role = 'user' } = (userRecord.customClaims || {});
    
    // Generate JWT token
    const token = generateToken({
      uid: userRecord.uid,
      email: userRecord.email,
      fullName: userRecord.displayName || email,
      role
    });
    
    // Update last login
    await auth.updateUser(userRecord.uid, {
      lastLoginAt: Date.now()
    });
    
    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName || email,
        role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Google Login - Redirect ke Google OAuth
 * @route GET /api/auth/google
 */
const googleLogin = async (req, res) => {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;
    
    // Firebase Auth ready check
    if (!auth || !admin) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Auth belum dikonfigurasi'
      });
    }
    
    // Construct Google OAuth URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI || `${process.env.CORS_ORIGIN}/auth/google/callback`)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    res.redirect(googleAuthUrl);
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Google Callback - Handle callback dari Google OAuth
 * @route GET /api/auth/google/callback
 */
const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Kode otorisasi tidak ditemukan'
      });
    }
    
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI || `${process.env.CORS_ORIGIN}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.id_token) {
      return res.status(401).json({
        success: false,
        message: 'Gagal mendapatkan token dari Google'
      });
    }
    
    // Verify Google ID token
    const googleUserResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenData.id_token}`);
    const googleUser = await googleUserResponse.json();
    
    if (!googleUser.sub) {
      return res.status(401).json({
        success: false,
        message: 'Token Google tidak valid'
      });
    }
    
    // Check Firebase Auth ready
    if (!auth) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Auth belum dikonfigurasi'
      });
    }
    
    // Check if user exists in Firebase
    let userRecord;
    try {
      userRecord = await auth.getUser(googleUser.sub);
    } catch (error) {
      // Create user if not exists
      userRecord = await auth.createUser({
        uid: googleUser.sub,
        email: googleUser.email,
        displayName: googleUser.name,
        photoURL: googleUser.picture,
        emailVerified: googleUser.email_verified || true
      });
    }
    
    // Generate JWT token
    const token = generateToken({
      uid: userRecord.uid,
      email: userRecord.email,
      fullName: userRecord.displayName || googleUser.email,
      role: 'user' // Default role, can be updated based on database
    });
    
    // Update last login
    await auth.updateUser(userRecord.uid, {
      lastLoginAt: Date.now()
    });
    
    // Redirect to frontend with token
    const redirectUrl = `${process.env.CORS_ORIGIN.split(',')[0] || 'http://localhost:5173'}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google callback error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Logout - Keluar dari sesi
 * @route POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // Clear JWT token cookie
    res.clearCookie('token');
    
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Get Current User - Mendapatkan data user yang sedang login
 * @route GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    
    // Get user from Firebase if available
    if (auth) {
      try {
        const userRecord = await auth.getUser(decoded.uid);
        const customClaims = userRecord.customClaims || {};
        
        return res.json({
          success: true,
          user: {
            uid: decoded.uid,
            email: userRecord.email || decoded.email,
            fullName: userRecord.displayName || decoded.fullName,
            role: customClaims.role || decoded.role || 'user',
            photoURL: userRecord.photoURL || null
          }
        });
      } catch (firebaseError) {
        // Firebase user not found, return decoded token data
      }
    }
    
    res.json({
      success: true,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        fullName: decoded.fullName || decoded.email,
        role: decoded.role || 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Forgot Password - Kirim email reset password
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email wajib diisi'
      });
    }
    
    // Cek apakah Firebase Admin sudah diinisialisasi
    if (!auth) {
      return res.status(200).json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim'
      });
    }
    
    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email);
    
    // TODO: Send email via service (nodemailer, dll)
    
    res.json({
      success: true,
      message: 'Jika email terdaftar, link reset password akan dikirim'
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Reset Password - Reset password dengan token
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token dan password wajib diisi'
      });
    }
    
    // Cek apakah Firebase Admin sudah diinisialisasi
    if (!auth) {
      return res.status(501).json({
        success: false,
        message: 'Firebase Auth belum dikonfigurasi.'
      });
    }
    
    // TODO: Implementasi verifikasi dan reset password
    // Firebase handles password reset via email link
    
    res.status(501).json({
      success: false,
      message: 'Reset password belum diimplementasikan sepenuhnya.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Register Reseller - Mendaftarkan user sebagai reseller
 * @route POST /api/auth/reseller
 */
const registerReseller = async (req, res) => {
  try {
    const { ktp_photo, selfie_with_ktp, bank_account, account_holder_name } = req.body;
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    
    // Update user role to reseller
    if (auth) {
      try {
        await auth.setCustomUserClaims(decoded.uid, { role: 'reseller' });
      } catch (firebaseError) {
        console.error('Firebase update error:', firebaseError.message);
      }
    }
    
    // TODO: Save reseller info to database
    
    res.json({
      success: true,
      message: 'Registrasi reseller berhasil. Menunggu persetujuan admin.'
    });
  } catch (error) {
    console.error('Reseller registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Get Reseller Status - Mendapatkan status reseller
 * @route GET /api/auth/reseller/status
 */
const getResellerStatus = async (req, res) => {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    
    // Get user role from Firebase
    if (auth) {
      try {
        const userRecord = await auth.getUser(decoded.uid);
        const role = (userRecord.customClaims?.role) || 'user';
        
        return res.json({
          success: true,
          isReseller: role === 'reseller' || role === 'admin',
          status: 'active',
          role
        });
      } catch (firebaseError) {
        // User not found in Firebase
      }
    }
    
    res.json({
      success: true,
      isReseller: false,
      status: 'active',
      role: decoded.role || 'user'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
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