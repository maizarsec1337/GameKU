const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// ====================
// STORAGE SETUP
// ====================

// Storage directory - centralized at project root storage/
const STORAGE_BASE = path.join(__dirname, '..', 'storage');
const STORAGE_DIRS = [
  'profile', 'avatars', 'reseller', 'ktp', 'selfie', 
  'store', 'product', 'products', 'banner', 'banners', 
  'category', 'categories', 'voucher', 'vouchers', 
  'promo', 'promos', 'giftcards', 'chat', 'review', 
  'reviews', 'documents', 'games', 'temp', 'deleted', 'logs',
  'users'
];

// Initialize storage directories
const initializeStorageDirs = () => {
  try {
    // Create storage base if needed
    if (!fs.existsSync(STORAGE_BASE)) {
      fs.mkdirSync(STORAGE_BASE, { recursive: true });
    }
    
    STORAGE_DIRS.forEach(dir => {
      const dirPath = path.join(STORAGE_BASE, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
    console.log('✓ Storage directories initialized');
  } catch (error) {
    console.error('❌ Storage initialization error:', error.message);
  }
};

initializeStorageDirs();

// Serve storage files statically with aggressive caching
app.use('/storage', express.static(STORAGE_BASE, {
  maxAge: '30d', // 30 days cache for storage
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set proper content type
    if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    } else if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
    // Cache control for images
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days immutable
    }
  }
}));

// Serve gambar folder (production assets) with cache
app.use('/gambar', express.static(path.join(__dirname, 'public', 'gambar'), {
  maxAge: '30d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Cache control for images
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    }
  }
}));

// ====================
// MIDDLEWARE
// ====================

// Body parsers - must be before security middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression for performance
app.use(compression());

// Cookie parser for session management
app.use(cookieParser());

// CORS configuration - restricted
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-CSRF-Token']
}));

// Security headers (customized helmet)
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "/storage"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Input sanitization
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, data }) => {
    console.warn(`NoSQL injection attempt from IP: ${req.ip}`);
  }
}));

// XSS Protection
const xss = require('xss-clean');
app.use(xss());

// HTTP Parameter Pollution protection
const hpp = require('hpp');
app.use(hpp({
  whitelist: ['sort', 'page', 'limit', 'category', 'search']
}));

// Security logging middleware
app.use((req, res, next) => {
  req.logSecurity = (event, details = {}) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.uid || req.user?.id || null,
      method: req.method,
      path: req.path,
      ...details
    }));
  };
  next();
});

// Morgan logging
app.use(morgan('dev'));

// ====================
// RATE LIMITING
// ====================

const rateLimit = require('express-rate-limit');

// Login rate limiter - 20 requests per 1 minute
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Terlalu banyak permintaan reset password. Coba lagi dalam 1 jam.' }
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Terlalu banyak permintaan API.' }
});

// ====================
// API ROUTES
// ====================

// Import routes with error handling - each route independently
let bannerRoutes, categoryRoutes, gameRoutes, voucherRoutes, promoRoutes, searchRoutes, authRoutes, adminRoutes, resellerRoutes, uploadRoutes;

try {
  bannerRoutes = require('./api/routes/banner');
} catch (error) {
  console.error('❌ Banner route import error:', error.message);
  bannerRoutes = express.Router();
}

try {
  categoryRoutes = require('./api/routes/category');
} catch (error) {
  console.error('❌ Category route import error:', error.message);
  categoryRoutes = express.Router();
}

try {
  gameRoutes = require('./api/routes/game');
} catch (error) {
  console.error('❌ Game route import error:', error.message);
  gameRoutes = express.Router();
}

try {
  voucherRoutes = require('./api/routes/voucher');
} catch (error) {
  console.error('❌ Voucher route import error:', error.message);
  voucherRoutes = express.Router();
}

try {
  promoRoutes = require('./api/routes/promo');
} catch (error) {
  console.error('❌ Promo route import error:', error.message);
  promoRoutes = express.Router();
}

try {
  searchRoutes = require('./api/routes/search');
} catch (error) {
  console.error('❌ Search route import error:', error.message);
  searchRoutes = express.Router();
}

try {
  authRoutes = require('./api/routes/auth');
} catch (error) {
  console.error('❌ Auth route import error:', error.message);
  authRoutes = express.Router();
}

try {
  adminRoutes = require('./api/routes/admin');
} catch (error) {
  console.error('❌ Admin route import error:', error.message);
  adminRoutes = express.Router();
}

try {
  resellerRoutes = require('./api/routes/reseller');
} catch (error) {
  console.error('❌ Reseller route import error:', error.message);
  resellerRoutes = express.Router();
}

try {
  uploadRoutes = require('./api/routes/upload');
} catch (error) {
  console.error('❌ Upload route import error:', error.message);
  uploadRoutes = express.Router();
}

// Apply general API rate limiting
app.use('/api/banner', apiRateLimiter, bannerRoutes);
app.use('/api/category', apiRateLimiter, categoryRoutes);
app.use('/api/game', apiRateLimiter, gameRoutes);
app.use('/api/voucher', apiRateLimiter, voucherRoutes);
app.use('/api/promo', apiRateLimiter, promoRoutes);
app.use('/api/search', apiRateLimiter, searchRoutes);
app.use('/api/admin', apiRateLimiter, adminRoutes);
app.use('/api/reseller', apiRateLimiter, resellerRoutes);
app.use('/api/upload', apiRateLimiter, uploadRoutes);

// Auth routes with login rate limiting
app.use('/api/auth', loginRateLimiter, authRoutes);

// ====================
// HEALTH CHECK
// ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ====================
// FRONTEND STATIC
// ====================

// Serve static files from public directory with cache
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// ====================
// ERROR HANDLER
// ====================

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// General error handler
app.use((err, req, res, next) => {
  console.error('Internal Error:', err);
  
  // Don't expose internal errors to user
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
});

module.exports = app;