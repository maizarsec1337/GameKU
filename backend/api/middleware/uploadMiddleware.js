const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  STORAGE_BASE, 
  STORAGE_DIRS, 
  ALLOWED_MIME_TYPES, 
  ALLOWED_EXTENSIONS,
  DANGEROUS_EXTENSIONS,
  sanitizeFilename,
  generateUniqueFilename
} = require('../helpers/storageHelper');

// Initialize storage directories
const initializeStorageDirs = () => {
  try {
    Object.keys(STORAGE_DIRS).forEach(dir => {
      const dirPath = path.join(STORAGE_BASE, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Created storage/${dir} directory`);
      }
    });
    console.log('✓ Upload Storage Ready');
    return true;
  } catch (error) {
    console.error('❌ Storage initialization error:', error.message);
    return false;
  }
};

// Storage engine for multer
const createStorage = (type) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const storagePath = path.join(STORAGE_BASE, type);
      // Ensure directory exists
      if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
      }
      cb(null, storagePath);
    },
    filename: (req, file, cb) => {
      const safeName = sanitizeFilename(file.originalname);
      const uniqueName = generateUniqueFilename(safeName);
      cb(null, uniqueName);
    }
  });
};

// File filter for security
const createFileFilter = (type = 'image') => {
  return (req, file, cb) => {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Reject dangerous extensions
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      return cb(new Error(`File dengan ekstensi ${ext} tidak diizinkan`), false);
    }
    
    // Check allowed extensions
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`Ekstensi file ${ext} tidak diizinkan`), false);
    }
    
    // Check MIME type
    const allowedMimeTypes = type === 'document' ? ALLOWED_MIME_TYPES.document : ALLOWED_MIME_TYPES.image;
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`Tipe file ${file.mimetype} tidak diizinkan`), false);
    }
    
    // For images, reject PDF
    if (type === 'image' && ext === '.pdf') {
      return cb(new Error('File gambar tidak boleh PDF'), false);
    }
    
    // For documents, only allow PDF
    if (type === 'document' && ext !== '.pdf') {
      return cb(new Error('File dokumen hanya boleh PDF'), false);
    }
    
    cb(null, true);
  };
};

// Safe get maxSize with fallback
const getMaxSize = (type, fallback = 5 * 1024 * 1024) => {
  if (STORAGE_DIRS && STORAGE_DIRS[type] && STORAGE_DIRS[type].maxSize) {
    return STORAGE_DIRS[type].maxSize;
  }
  return fallback;
};

// Create upload middleware for different types with safe maxSize
const uploadAvatar = multer({
  storage: createStorage('profile'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('profile', getMaxSize('avatars', 2 * 1024 * 1024)) }
}).single('avatar');

const uploadProduct = multer({
  storage: createStorage('product'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('product', getMaxSize('products', 5 * 1024 * 1024)) }
}).single('image');

const uploadBanner = multer({
  storage: createStorage('banner'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('banner', getMaxSize('banners', 10 * 1024 * 1024)) }
}).single('image');

const uploadPromo = multer({
  storage: createStorage('promo'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('promo', getMaxSize('promos', 10 * 1024 * 1024)) }
}).single('image');

const uploadVoucher = multer({
  storage: createStorage('voucher'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('voucher', getMaxSize('vouchers', 2 * 1024 * 1024)) }
}).single('image');

const uploadCategory = multer({
  storage: createStorage('category'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('category', getMaxSize('categories', 5 * 1024 * 1024)) }
}).single('image');

const uploadKTP = multer({
  storage: createStorage('ktp'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('ktp', 5 * 1024 * 1024) }
}).single('ktp_image');

const uploadSelfie = multer({
  storage: createStorage('selfie'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('selfie', 5 * 1024 * 1024) }
}).single('selfie_image');

const uploadStoreLogo = multer({
  storage: createStorage('store'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('store', 5 * 1024 * 1024) }
}).single('logo');

const uploadDocument = multer({
  storage: createStorage('documents'),
  fileFilter: createFileFilter('document'),
  limits: { fileSize: getMaxSize('documents', 5 * 1024 * 1024) }
}).single('document');

const uploadChat = multer({
  storage: createStorage('chat'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('chat', 5 * 1024 * 1024) }
}).single('image');

const uploadReview = multer({
  storage: createStorage('review'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('review', getMaxSize('reviews', 5 * 1024 * 1024)) }
}).single('image');

const uploadGame = multer({
  storage: createStorage('games'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: getMaxSize('games', 5 * 1024 * 1024) }
}).single('image');

// Upload product images - thumbnail, gallery, and optional video
const uploadProductImages = (req, res, next) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const productId = req.params.id || req.body.productId || Date.now();
        const storagePath = path.join(STORAGE_BASE, 'products', String(productId));
        if (!fs.existsSync(storagePath)) {
          fs.mkdirSync(storagePath, { recursive: true });
        }
        cb(null, storagePath);
      },
      filename: (req, file, cb) => {
        const safeName = sanitizeFilename(file.originalname);
        const uniqueName = generateUniqueFilename(safeName);
        cb(null, uniqueName);
      }
    }),
    fileFilter: createFileFilter('image'),
    limits: { fileSize: getMaxSize('products', 10 * 1024 * 1024) }
  }).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'video', maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Ukuran file terlalu besar (maksimal 10MB)'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: err.field === 'gallery' ? 'Maksimal 10 gambar gallery' : 'Jumlah file tidak valid'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Process uploaded files and add storage paths
    if (req.files) {
      req.uploadedFiles = {};
      
      if (req.files.thumbnail) {
        req.uploadedFiles.thumbnail = req.files.thumbnail.map(file => ({
          originalName: file.originalname,
          path: path.relative(STORAGE_BASE, file.path),
          size: file.size,
          mimeType: file.mimetype
        }));
      }
      
      if (req.files.gallery) {
        req.uploadedFiles.gallery = req.files.gallery.map((file, index) => ({
          originalName: file.originalname,
          path: path.relative(STORAGE_BASE, file.path),
          size: file.size,
          mimeType: file.mimetype,
          position: index
        }));
      }
      
      if (req.files.video) {
        req.uploadedFiles.video = req.files.video.map(file => ({
          originalName: file.originalname,
          path: path.relative(STORAGE_BASE, file.path),
          size: file.size,
          mimeType: file.mimetype
        }));
      }
    }
    
    next();
  });
};

// Special middleware for KYC (multiple files) - reseller registration
const uploadKYC = (req, res, next) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        let dest = 'temp';
        if (file.fieldname === 'ktp_image') dest = 'ktp';
        if (file.fieldname === 'selfie_image') dest = 'selfie';
        if (file.fieldname === 'store_logo') dest = 'store';
        const storagePath = path.join(STORAGE_BASE, dest);
        if (!fs.existsSync(storagePath)) {
          fs.mkdirSync(storagePath, { recursive: true });
        }
        cb(null, storagePath);
      },
      filename: (req, file, cb) => {
        const safeName = sanitizeFilename(file.originalname);
        const uniqueName = generateUniqueFilename(safeName);
        cb(null, uniqueName);
      }
    }),
    fileFilter: createFileFilter('image'),
    limits: { fileSize: getMaxSize('ktp', getMaxSize('selfie', getMaxSize('store', 5 * 1024 * 1024))) }
  }).fields([
    { name: 'ktp_image', maxCount: 1 },
    { name: 'selfie_image', maxCount: 1 },
    { name: 'store_logo', maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Ukuran file terlalu besar'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// Middleware wrapper to handle errors and cleanup
const createUploadMiddleware = (upload) => {
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer error (file size, file count, etc)
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file terlalu besar'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Jumlah file terlalu banyak'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        // File filter error
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      // No file uploaded - this is okay for optional uploads
      if (!req.file) {
        return next();
      }
      
      // Add storage path to request
      req.file.storageRelativePath = `/storage/${path.relative(STORAGE_BASE, req.file.path)}`;
      
      next();
    });
  };
};

// Clean up temporary files on error
const cleanupTempFile = (req, res, next) => {
  // Clean up uploaded file if response has error status
  res.on('finish', () => {
    if (res.statusCode >= 400 && req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (error) {
        console.error('Cleanup error:', error.message);
      }
    }
  });
  next();
};

module.exports = {
  initializeStorageDirs,
  createUploadMiddleware,
  cleanupTempFile,
  uploadKYC,
  uploadAvatar: createUploadMiddleware(uploadAvatar),
  uploadProduct: createUploadMiddleware(uploadProduct),
  uploadProductImages,
  uploadBanner: createUploadMiddleware(uploadBanner),
  uploadPromo: createUploadMiddleware(uploadPromo),
  uploadVoucher: createUploadMiddleware(uploadVoucher),
  uploadCategory: createUploadMiddleware(uploadCategory),
  uploadKTP: createUploadMiddleware(uploadKTP),
  uploadSelfie: createUploadMiddleware(uploadSelfie),
  uploadStoreLogo: createUploadMiddleware(uploadStoreLogo),
  uploadDocument: createUploadMiddleware(uploadDocument),
  uploadChat: createUploadMiddleware(uploadChat),
  uploadReview: createUploadMiddleware(uploadReview),
  uploadGame: createUploadMiddleware(uploadGame)
};