/**
 * Security Middleware
 * Comprehensive security protection for GameKU
 */

const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const csrf = require('csurf');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Storage base directory for file validation
const STORAGE_BASE = path.join(__dirname, '..', '..', 'storage');

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Allowed MIME types for documents
const ALLOWED_DOCUMENT_MIME_TYPES = ['application/pdf'];

// Allowed extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Allowed document extensions
const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf'];

// Dangerous extensions to reject
const DANGEROUS_EXTENSIONS = ['.svg', '.php', '.js', '.html', '.exe', '.sh', '.bat', '.cmd', '.ps1'];

// ============ RATE LIMITING ============

// Login rate limiter - 20 attempts per 1 minute
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// OTP rate limiter - 3 attempts per hour
const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan OTP. Coba lagi dalam 1 jam.'
  },
});

// Forgot password rate limiter - 3 attempts per hour
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan reset password. Coba lagi dalam 1 jam.'
  },
});

// General API rate limiter - 100 requests per 15 minutes
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan API. Silakan kurangi frekuensi.'
  },
});

// Search rate limiter - 30 requests per minute
const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan pencarian. Kurangi frekuensi.'
  },
});

// Upload rate limiter - 10 uploads per hour
const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Batas upload tercapai. Coba lagi nanti.'
  },
});

// ============ INPUT VALIDATION ============

// Whitelist validation for common fields
const whitelistValidate = (allowedFields) => {
  return (req, res, next) => {
    const requestData = { ...req.body, ...req.query, ...req.params };
    const invalidFields = Object.keys(requestData).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field tidak diizinkan: ${invalidFields.join(', ')}`
      });
    }
    next();
  };
};

// Email validation
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format email tidak valid'
    });
  }
  next();
};

// Phone validation (Indonesian format)
const validatePhone = (req, res, next) => {
  const { phone } = req.body;
  if (phone && !/^08[0-9]{8,12}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Format nomor telepon tidak valid'
    });
  }
  next();
};

// Password validation
const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (password && password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password minimal 6 karakter'
    });
  }
  next();
};

// ============ SANITIZATION ============

// XSS Protection
const xssProtection = xss();

// NoSQL Injection Protection
const noSqlInjectionProtection = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, data }) => {
    console.warn(`NoSQL injection attempt detected from IP: ${req.ip}`);
  }
});

// HPP (HTTP Parameter Pollution) Protection
const hppProtection = hpp({
  whitelist: ['sort', 'page', 'limit']
});

// ============ CSRF PROTECTION ============

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

// ============ HELMET SECURITY HEADERS ============

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "/storage"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  permissionsPolicy: {
    features: {
      camera: ['none'],
      microphone: ['none'],
      geolocation: ['none'],
      payment: ['none'],
    }
  }
});

// ============ PATH TRAVERSAL PROTECTION ============

const preventPathTraversal = (req, res, next) => {
  const checkValue = (value) => {
    if (typeof value === 'string') {
      const dangerousPatterns = ['../', '..\\', '/etc/', '/proc/', '<', '>', '|', '`', '$', ';'];
      for (const pattern of dangerousPatterns) {
        if (value.includes(pattern)) {
          return false;
        }
      }
    }
    return true;
  };

  const checkObject = (obj) => {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && !checkValue(obj[key])) {
        return false;
      }
      if (typeof obj[key] === 'object' && !checkObject(obj[key])) {
        return false;
      }
    }
    return true;
  };

  if (!checkObject({ ...req.body, ...req.query, ...req.params })) {
    return res.status(400).json({
      success: false,
      message: 'Input mengandung karakter tidak aman'
    });
  }
  next();
};

// ============ COOKIE SECURITY ============

const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

// ============ FILE UPLOAD SECURITY ============

const validateFileUpload = (maxSize = 5 * 1024 * 1024, fileType = 'image') => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    const file = req.file || (req.files && req.files[0]);
    
    if (file) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `Ukuran file terlalu besar (maksimal ${Math.round(maxSize / (1024 * 1024))}MB)`
        });
      }

      // Check extension
      const ext = path.extname(file.originalname).toLowerCase();
      
      // Reject dangerous extensions
      if (DANGEROUS_EXTENSIONS.includes(ext)) {
        return res.status(400).json({
          success: false,
          message: `File dengan ekstensi ${ext} tidak diizinkan`
        });
      }
      
      // Check allowed extensions
      const allowedExts = fileType === 'document' ? ALLOWED_DOCUMENT_EXTENSIONS : ALLOWED_EXTENSIONS;
      if (!allowedExts.includes(ext)) {
        return res.status(400).json({
          success: false,
          message: `Ekstensi file ${ext} tidak diizinkan`
        });
      }

      // Check MIME type
      const allowedMimes = fileType === 'document' ? ALLOWED_DOCUMENT_MIME_TYPES : ALLOWED_MIME_TYPES;
      if (!allowedMimes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Tipe file ${file.mimetype} tidak diizinkan`
        });
      }

      // Generate safe filename
      const crypto = require('crypto');
      const safeName = crypto.randomBytes(16).toString('hex') + ext;
      file.safeName = safeName;
    }

    next();
  };
};

// Sanitize filename
const sanitizeFilename = (filename) => {
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  return sanitized;
};

// ============ ERROR HANDLING ============

const errorHandler = (err, req, res, next) => {
  // Log error internally
  console.error('Internal Error:', err);

  // Don't expose internal errors to user
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'CSRF token tidak valid'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
};

// ============ SECURITY LOGGING ============

const securityLogger = (req, res, next) => {
  const logSecurityEvent = (event, details = {}) => {
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

  req.logSecurity = logSecurityEvent;
  next();
};

module.exports = {
  // Rate limiters
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
  apiRateLimiter,
  searchRateLimiter,
  uploadRateLimiter,
  
  // Validation
  whitelistValidate,
  validateEmail,
  validatePhone,
  validatePassword,
  
  // Sanitization
  xssProtection,
  noSqlInjectionProtection,
  hppProtection,
  
  // CSRF
  csrfProtection,
  
  // Headers
  securityHeaders,
  
  // Path traversal
  preventPathTraversal,
  
  // Cookie
  secureCookieOptions,
  
  // Upload
  validateFileUpload,
  sanitizeFilename,
  
  // Error handling
  errorHandler,
  
  // Logging
  securityLogger
};