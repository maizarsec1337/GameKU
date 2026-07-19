/**
 * Auth Controller
 * Controller untuk endpoint autentikasi
 * 
 * Menggunakan autentikasi berbasis JWT + MongoDB (tanpa Firebase Client SDK)
 * - Semua login/register via backend
 * - Google OAuth via redirect flow
 * - JWT token untuk session
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const mongoose = require('mongoose');

// Use global fetch (Node.js 18+) or fallback to node-fetch
const fetch = global.fetch || require('node-fetch');

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

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
    
    // If MongoDB is not connected, use dev mode registration
    if (!isMongoConnected()) {
      if (process.env.DEV_MODE === 'true') {
        const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const token = generateToken({
          uid,
          email,
          fullName: fullName || '',
          role: role || 'user'
        });
        
        return res.status(201).json({
          success: true,
          message: 'Registrasi berhasil (offline mode)',
          user: {
            uid,
            email,
            fullName: fullName || '',
            role: role || 'user'
          },
          token
        });
      }
      
      return res.status(503).json({
        success: false,
        message: 'Database tidak tersedia. Silakan coba lagi nanti.'
      });
    }
    
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in MongoDB with unique uid
    const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const user = await User.create({
      uid,
      email,
      fullName: fullName || '',
      username: username || '',
      phone: phone || '',
      password: hashedPassword,
      role: role || 'user',
      status: 'active',
      lastLoginAt: new Date(),
      createdAt: new Date()
    });
    
    // Generate JWT token
    const token = generateToken({
      uid: user.uid,
      email: user.email,
      role: user.role
    });
    
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    if (error.code === '11000') {
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
          email: 'admin@gameku.com',
          password: 'admin123',
          fullName: 'Administrator',
          role: 'admin'
        },
        user: {
          uid: 'user-456',
          email: 'user@gameku.com',
          password: 'user123',
          fullName: 'Regular User',
          role: 'user'
        },
        reseller: {
          uid: 'reseller-789',
          email: 'reseller@gameku.com',
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
        
        // Try to create user in MongoDB if connected (non-blocking)
        if (isMongoConnected()) {
          User.findOneAndUpdate(
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
          ).catch(() => {});
        }
        
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
    
    // If MongoDB is not connected, return error
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database tidak tersedia. Silakan coba lagi nanti.'
      });
    }
    
    // Production mode: MongoDB authentication
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Update last login
    await User.findOneAndUpdate(
      { uid: user.uid },
      { lastLoginAt: new Date() }
    );
    
    // Generate JWT token
    const token = generateToken({
      uid: user.uid,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
    
    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        role: user.role
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
 * Google OAuth Redirect - Redirect ke Google OAuth
 * @route GET /api/auth/google
 */
const googleLogin = async (req, res) => {
  console.log('[GOOGLE LOGIN] ====================================');
  console.log('[GOOGLE LOGIN] Step 1: Checking ENV variables');
  
  // Check missing ENV variables
  const missingVars = [];
  if (!process.env.GOOGLE_CLIENT_ID) missingVars.push('Missing GOOGLE_CLIENT_ID');
  if (!process.env.GOOGLE_CLIENT_SECRET) missingVars.push('Missing GOOGLE_CLIENT_SECRET');
  if (!process.env.GOOGLE_REDIRECT_URI) missingVars.push('Missing GOOGLE_REDIRECT_URI');
  
  const isDevMode = process.env.DEV_MODE === 'true';
  const hasAllCredentials = missingVars.length === 0;
  
  console.log('[GOOGLE LOGIN] DEV_MODE:', isDevMode);
  console.log('[GOOGLE LOGIN] Missing vars:', missingVars.length === 0 ? 'none' : missingVars);
  
  // If missing credentials but in dev mode, create mock Google user (no MongoDB dependency)
  if (!hasAllCredentials && isDevMode) {
    console.log('[GOOGLE LOGIN] DEV MODE: Using mock Google OAuth');
    
    try {
      // Create a mock Google user in dev mode (no DB required)
      const timestamp = Date.now();
      const mockGoogleUser = {
        uid: `google-dev-${timestamp}`,
        email: `google-user-${timestamp}@example.com`,
        fullName: 'Google Dev User',
        photoURL: '/gambar/avatar/default.png',
        role: 'user'
      };
      
      console.log('[GOOGLE LOGIN] Step 2: Mock user created:', mockGoogleUser.email);
      
      // Generate JWT token (no MongoDB dependency)
      const token = generateToken(mockGoogleUser);
      console.log('[GOOGLE LOGIN] JWT token generated');
      
      // Redirect to frontend with token
      const corsOrigin = process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173';
      const redirectUrl = `${corsOrigin}/login?token=${token}`;
      
      console.log('[GOOGLE LOGIN] Step 3: Redirecting to frontend with mock token');
      console.log('[GOOGLE LOGIN] Redirect URL:', redirectUrl);
      
      return res.redirect(redirectUrl);
    } catch (devError) {
      console.error('[GOOGLE LOGIN] Dev mode mock error:', devError.message);
      console.error('[GOOGLE LOGIN] devError.stack:', devError.stack);
      return res.status(500).json({
        success: false,
        message: 'Error in dev mode mock',
        error: devError.message
      });
    }
  }
  
  // If still missing after dev mode check, return error
  if (!hasAllCredentials) {
    console.error('[GOOGLE LOGIN] ENV Error - Variables missing:', missingVars);
    return res.status(500).json({
      success: false,
      message: 'Google OAuth belum dikonfigurasi - ENV variables missing',
      errors: missingVars
    });
  }
  
  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
    
    console.log('[GOOGLE LOGIN] All ENV variables present');
    console.log('[GOOGLE LOGIN] GOOGLE_CLIENT_ID length:', GOOGLE_CLIENT_ID.length);
    console.log('[GOOGLE LOGIN] GOOGLE_REDIRECT_URI:', GOOGLE_REDIRECT_URI);
    
    console.log('[GOOGLE LOGIN] Step 2: Building Google OAuth URL');
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=profile%20email&access_type=offline`;
    
    console.log('[GOOGLE LOGIN] Step 3: Redirecting to Google');
    
    res.redirect(googleAuthUrl);
  } catch (error) {
    console.error('[GOOGLE LOGIN] Exception caught:');
    console.error('[GOOGLE LOGIN] error.name:', error.name);
    console.error('[GOOGLE LOGIN] error.message:', error.message);
    console.error('[GOOGLE LOGIN] error.stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 * Google Callback - Handle callback dari Google OAuth
 * @route GET /api/auth/google/callback
 */
const googleCallback = async (req, res) => {
  console.log('[GOOGLE CALLBACK] =================================');
  
  try {
    const { code, error: oauthError, error_description } = req.query;
    
    // Check for OAuth error from Google
    if (oauthError) {
      console.error('[GOOGLE CALLBACK] OAuth Error from Google:', oauthError, error_description);
      return res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/login?error=${oauthError}`);
    }
    
    if (!code) {
      console.error('[GOOGLE CALLBACK] No authorization code received');
      return res.status(400).json({
        success: false,
        message: 'Kode otorisasi tidak ditemukan'
      });
    }
    
    console.log('[GOOGLE CALLBACK] Step 1: Received authorization code');
    console.log('[GOOGLE CALLBACK] Code length:', code.length);
    
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, CORS_ORIGIN } = process.env;
    
    // Exchange code for tokens
    console.log('[GOOGLE CALLBACK] Step 2: Exchanging code for tokens');
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI || `${CORS_ORIGIN}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    console.log('[GOOGLE CALLBACK] Token response status:', tokenResponse.status);
    
    if (!tokenData.id_token) {
      console.error('[GOOGLE CALLBACK] Failed to get id_token, response:', JSON.stringify(tokenData));
      return res.status(401).json({
        success: false,
        message: 'Gagal mendapatkan token dari Google',
        details: tokenData
      });
    }
    
    // Verify Google ID token
    console.log('[GOOGLE CALLBACK] Step 3: Verifying Google ID token');
    
    const googleUserResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenData.id_token}`);
    const googleUser = await googleUserResponse.json();
    
    console.log('[GOOGLE CALLBACK] Google user data received');
    
    if (!googleUser.sub) {
      console.error('[GOOGLE CALLBACK] Invalid Google token, response:', JSON.stringify(googleUser));
      return res.status(401).json({
        success: false,
        message: 'Token Google tidak valid',
        details: googleUser
      });
    }
    
    // Check or create user in MongoDB (non-blocking)
    console.log('[GOOGLE CALLBACK] Step 4: Checking/creating user in MongoDB');
    
    let user;
    if (isMongoConnected()) {
      try {
        user = await User.findOne({ email: googleUser.email });
        
        if (!user) {
          console.log('[GOOGLE CALLBACK] Creating new user:', googleUser.email);
          user = await User.create({
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
          // Update last login
          await User.findOneAndUpdate(
            { email: googleUser.email },
            { lastLoginAt: new Date() }
          );
        }
      } catch (mongoErr) {
        console.warn('[GOOGLE CALLBACK] MongoDB operation failed, using fallback:', mongoErr.message);
      }
    } else {
      console.log('[GOOGLE CALLBACK] MongoDB not connected, using Google data directly');
    }
    
    // Generate JWT token
    const token = generateToken({
      uid: user?.uid || googleUser.sub,
      email: user?.email || googleUser.email,
      fullName: user?.fullName || googleUser.name,
      role: user?.role || 'user'
    });
    
    // Redirect to frontend with token
    const redirectUrl = `${CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/login?token=${token}`;
    
    console.log('[GOOGLE CALLBACK] Step 5: Redirecting to frontend');
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('[GOOGLE CALLBACK] Exception caught:');
    console.error('[GOOGLE CALLBACK] error.name:', error.name);
    console.error('[GOOGLE CALLBACK] error.message:', error.message);
    console.error('[GOOGLE CALLBACK] error.stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: {
        name: error.name,
        message: error.message
      }
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
    
    // If MongoDB is connected, get full user data from DB
    if (isMongoConnected()) {
      try {
        const mongoUser = await User.findOne({ uid: decoded.uid });
        
        if (mongoUser) {
          const userData = {
            uid: mongoUser.uid,
            email: mongoUser.email,
            fullName: mongoUser.fullName,
            role: mongoUser.role,
            status: mongoUser.status,
            photoURL: mongoUser.photoURL,
            phone: mongoUser.phone,
            balance: mongoUser.balance
          };
          
          return res.json({
            success: true,
            user: userData
          });
        }
      } catch (mongoErr) {
        console.warn('getMe MongoDB lookup failed:', mongoErr.message);
        // Fall through to JWT fallback
      }
    }
    
    // Fallback: return user data from JWT token (works without MongoDB)
    const userData = {
      uid: decoded.uid,
      email: decoded.email,
      fullName: decoded.fullName || decoded.email,
      role: decoded.role || 'user',
      status: 'active',
      photoURL: '/gambar/avatar/default.png',
      phone: '',
      balance: 0
    };
    
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
    
    // Check if user exists (if MongoDB connected)
    if (isMongoConnected()) {
      try {
        await User.findOne({ email });
      } catch (mongoErr) {
        // Silent fail
      }
    }
    
    // Don't reveal if user exists or not
    res.json({
      success: true,
      message: 'Jika email terdaftar, link reset password akan dikirim'
    });
  } catch (error) {
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
    
    // TODO: Implementasi verifikasi dan reset password via email
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
    
    // Update user role to reseller in MongoDB (if connected)
    if (isMongoConnected() && User) {
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
    
    // Get user from MongoDB (if connected)
    let role = decoded.role || 'user';
    let status = 'active';
    
    if (isMongoConnected() && User) {
      try {
        const mongoUser = await User.findOne({ uid: decoded.uid });
        if (mongoUser) {
          role = mongoUser.role;
          status = mongoUser.status;
        }
      } catch (mongoError) {
        console.warn('MongoDB lookup failed:', mongoError.message);
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

/**
 * Get User Profile - Mendapatkan profil user
 * @route GET /api/auth/user/profile
 */
const getUserProfile = async (req, res) => {
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
    
    // Get user from MongoDB (if connected)
    let userData = null;
    
    if (isMongoConnected() && User) {
      try {
        const mongoUser = await User.findOne({ uid: decoded.uid });
        if (mongoUser) {
          userData = {
            uid: mongoUser.uid,
            email: mongoUser.email,
            fullName: mongoUser.fullName,
            phone: mongoUser.phone,
            role: mongoUser.role,
            status: mongoUser.status,
            photoURL: mongoUser.photoURL,
            balance: mongoUser.balance,
            createdAt: mongoUser.createdAt,
            updatedAt: mongoUser.updatedAt
          };
        }
      } catch (mongoError) {
        console.warn('MongoDB lookup failed:', mongoError.message);
      }
    }
    
    // Fallback to JWT data if MongoDB unavailable
    if (!userData) {
      userData = {
        uid: decoded.uid,
        email: decoded.email,
        fullName: decoded.fullName || decoded.email,
        phone: '',
        role: decoded.role || 'user',
        status: 'active',
        photoURL: '/gambar/avatar/default.png',
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

/**
 * Update User Profile - Memperbarui profil user
 * @route PUT /api/auth/user/profile
 */
const updateProfile = async (req, res) => {
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
    
    const { fullName, phone } = req.body;
    
    // Update user in MongoDB (if connected)
    if (isMongoConnected() && User) {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { uid: decoded.uid },
          { 
            ...(fullName && { fullName }),
            ...(phone && { phone }),
            updatedAt: new Date()
          },
          { new: true }
        );
        
        if (updatedUser) {
          return res.json({
            success: true,
            message: 'Profil berhasil diperbarui',
            data: {
              uid: updatedUser.uid,
              email: updatedUser.email,
              fullName: updatedUser.fullName,
              phone: updatedUser.phone,
              role: updatedUser.role
            }
          });
        }
      } catch (mongoError) {
        console.error('MongoDB update error:', mongoError.message);
      }
    }
    
    // If MongoDB not connected, return success with JWT data
    if (!isMongoConnected()) {
      return res.json({
        success: true,
        message: 'Profil berhasil diperbarui (offline mode)',
        data: {
          uid: decoded.uid,
          email: decoded.email,
          fullName: fullName || decoded.fullName,
          phone: phone || '',
          role: decoded.role || 'user'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui profil'
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
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
  getResellerStatus,
  getUserProfile,
  updateProfile
};