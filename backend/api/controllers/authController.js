/**
 * Auth Controller
 * Controller untuk endpoint autentikasi
 */

const { auth, admin, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Use global fetch (Node.js 18+) or fallback to node-fetch
const fetch = global.fetch || require('node-fetch');

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
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    } catch (error) {
      // User doesn't exist, create new
      userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
      });
    }
    
    // Set custom claims untuk role
    if (role) {
      await auth.setCustomUserClaims(userRecord.uid, { role });
    }
    
    // Create user in MongoDB
    await User.findOneAndUpdate(
      { uid: userRecord.uid },
      {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName || fullName,
        username: username || '',
        phone: phone || '',
        role: role || 'user',
        status: 'active',
        lastLoginAt: new Date()
      },
      { upsert: true, new: true }
    );
    
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
        fullName: userRecord.displayName || fullName,
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
    console.error('Register error:', error.message);
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

        // Create user in MongoDB if not exists
        await User.findOneAndUpdate(
          { uid: devUser.uid },
          {
            uid: devUser.uid,
            email: devUser.email,
            fullName: devUser.fullName,
            role: devUser.role,
            status: 'active',
            lastLoginAt: new Date()
          },
          { upsert: true, new: true }
        );

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
    
    // Update user in MongoDB
    await User.findOneAndUpdate(
      { uid: userRecord.uid },
      {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName || email,
        role: role,
        status: 'active',
        lastLoginAt: new Date()
      },
      { upsert: true, new: true }
    );

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
 * Firebase Google Login - Verify Firebase ID Token
 * Frontend handles Google OAuth with Firebase SDK, backend only verifies token
 * @route POST /api/auth/google
 */
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token diperlukan'
      });
    }
    
    // Firebase Auth ready check
    if (!auth) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Auth belum dikonfigurasi'
      });
    }
    
    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (verifyError) {
      console.error('Firebase token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Token Firebase tidak valid'
      });
    }
    
    const { uid, email, name, picture } = decodedToken;
    
    // Check if user exists in Firebase
    let userRecord;
    try {
      userRecord = await auth.getUser(uid);
    } catch (error) {
      // Create user if not exists
      userRecord = await auth.createUser({
        uid,
        email,
        displayName: name || email,
        photoURL: picture,
        emailVerified: true
      });
    }
    
    // Get or determine user role
    let role = 'user';
    let mongoUser = null;
    
    // Check if user exists in MongoDB first (with fallback)
    try {
      mongoUser = await User.findOne({ uid });
    } catch (mongoError) {
      console.warn('MongoDB lookup failed, continuing without DB:', mongoError.message);
    }
    
    if (!mongoUser && User) {
      try {
        // Create new user in MongoDB
        mongoUser = await User.create({
          uid,
          email,
          fullName: name || email,
          photoURL: picture || '/gambar/avatar/default.png',
          role: 'user',
          status: 'active',
          lastLoginAt: new Date(),
          createdAt: new Date()
        });
      } catch (mongoCreateError) {
        console.warn('MongoDB create failed, continuing without DB:', mongoCreateError.message);
      }
    }
    
    // Update last login and other info if MongoDB available
    if (mongoUser) {
      try {
        mongoUser.lastLoginAt = new Date();
        if (name) mongoUser.fullName = name;
        if (picture) mongoUser.photoURL = picture;
        await mongoUser.save();
        // Use role from MongoDB if available
        if (mongoUser.role) {
          role = mongoUser.role;
        }
      } catch (mongoUpdateError) {
        console.warn('MongoDB update failed:', mongoUpdateError.message);
      }
    }
    
    // Generate JWT token
    const token = generateToken({
      uid: userRecord.uid,
      email: userRecord.email,
      fullName: userRecord.displayName || email,
      role
    });
    
    // Update last login in Firebase
    await auth.updateUser(userRecord.uid, {
      lastLoginAt: Date.now()
    });

    res.json({
      success: true,
      message: 'Login Google berhasil',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName || email,
        photoURL: userRecord.photoURL || mongoUser?.photoURL,
        role
      },
      token
    });
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
    
    // Determine role - default to 'user'
    let role = 'user';
    let mongoUser = null;
    
    // Check or create user in MongoDB (with fallback)
    if (User) {
      try {
        mongoUser = await User.findOne({ uid: googleUser.sub });
        
        if (!mongoUser) {
          mongoUser = await User.create({
            uid: googleUser.sub,
            email: googleUser.email,
            fullName: googleUser.name || googleUser.email,
            photoURL: googleUser.picture || '/gambar/avatar/default.png',
            role: 'user',
            status: 'active',
            lastLoginAt: new Date(),
            createdAt: new Date()
          });
        } else {
          mongoUser.lastLoginAt = new Date();
          if (googleUser.name) mongoUser.fullName = googleUser.name;
          if (googleUser.picture) mongoUser.photoURL = googleUser.picture;
          await mongoUser.save();
        }
        
        // Use role from MongoDB
        if (mongoUser && mongoUser.role) {
          role = mongoUser.role;
        }
      } catch (mongoError) {
        console.warn('MongoDB operation failed, continuing without DB:', mongoError.message);
      }
    }
    
    // Generate JWT token
    const token = generateToken({
      uid: userRecord.uid,
      email: userRecord.email,
      fullName: userRecord.displayName || googleUser.email,
      role
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
    
    // Try to get user from MongoDB first
    let userData = null;
    try {
      const mongoUser = await User.findOne({ uid: decoded.uid });
      if (mongoUser) {
        userData = {
          uid: mongoUser.uid,
          email: mongoUser.email,
          fullName: mongoUser.fullName,
          role: mongoUser.role,
          status: mongoUser.status,
          photoURL: mongoUser.photoURL,
          phone: mongoUser.phone,
          balance: mongoUser.balance
        };
      }
    } catch (mongoError) {
      console.warn('MongoDB user lookup failed:', mongoError.message);
    }
    
    // Fallback to Firebase if MongoDB not available
    if (!userData && auth) {
      try {
        const userRecord = await auth.getUser(decoded.uid);
        userData = {
          uid: decoded.uid,
          email: userRecord.email || decoded.email,
          fullName: userRecord.displayName || decoded.fullName,
          role: (userRecord.customClaims?.role) || decoded.role || 'user',
          photoURL: userRecord.photoURL
        };
      } catch (firebaseError) {
        // Firebase user not found, return decoded token data
        userData = {
          uid: decoded.uid,
          email: decoded.email,
          fullName: decoded.fullName || decoded.email,
          role: decoded.role || 'user'
        };
      }
    }
    
    if (!userData) {
      userData = {
        uid: decoded.uid,
        email: decoded.email,
        fullName: decoded.fullName || decoded.email,
        role: decoded.role || 'user'
      };
    }

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('getMe error:', error.message);
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
    
    // Update user role to reseller in MongoDB
    if (User) {
      try {
        await User.findOneAndUpdate(
          { uid: decoded.uid },
          { 
            role: 'reseller',
            status: 'active',
            'resellerInfo.bankAccount': bank_account,
            'resellerInfo.accountHolderName': account_holder_name,
            'resellerInfo.resellerStatus': 'pending'
          },
          { upsert: true }
        );
      } catch (mongoError) {
        console.error('MongoDB update error:', mongoError.message);
      }
    }
    
    // Update user role to reseller in Firebase
    if (auth) {
      try {
        await auth.setCustomUserClaims(decoded.uid, { role: 'reseller' });
      } catch (firebaseError) {
        console.error('Firebase update error:', firebaseError.message);
      }
    }
    
    // TODO: Save reseller info to storage
    
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
    
    // Get user from MongoDB first
    let role = 'user';
    let status = 'active';
    
    if (User) {
      try {
        const mongoUser = await User.findOne({ uid: decoded.uid });
        if (mongoUser) {
          role = mongoUser.role;
          status = mongoUser.status;
        }
      } catch (mongoError) {
        // Continue with Firebase fallback
      }
    }
    
    // Fallback to Firebase if MongoDB not found
    if (auth && role === 'user') {
      try {
        const userRecord = await auth.getUser(decoded.uid);
        role = (userRecord.customClaims?.role) || 'user';
      } catch (firebaseError) {
        // User not found in Firebase
      }
    }
    
    res.json({
      success: true,
      isReseller: role === 'reseller' || role === 'admin',
      status,
      role
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