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
  Object.keys(STORAGE_DIRS).forEach(dir => {
    const dirPath = path.join(STORAGE_BASE, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
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

// Create upload middleware for different types
const uploadAvatar = multer({
  storage: createStorage('avatars'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.avatars.maxSize }
}).single('avatar');

const uploadProduct = multer({
  storage: createStorage('products'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.products.maxSize }
}).single('image');

const uploadBanner = multer({
  storage: createStorage('banners'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.banners.maxSize }
}).single('image');

const uploadPromo = multer({
  storage: createStorage('promos'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.promos.maxSize }
}).single('image');

const uploadVoucher = multer({
  storage: createStorage('vouchers'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.vouchers.maxSize }
}).single('image');

const uploadCategory = multer({
  storage: createStorage('categories'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.categories.maxSize }
}).single('image');

const uploadKTP = multer({
  storage: createStorage('ktp'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.ktp.maxSize }
}).single('ktp_photo');

const uploadSelfie = multer({
  storage: createStorage('selfie'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.selfie.maxSize }
}).single('selfie_with_ktp');

const uploadDocument = multer({
  storage: createStorage('documents'),
  fileFilter: createFileFilter('document'),
  limits: { fileSize: STORAGE_DIRS.documents.maxSize }
}).single('document');

const uploadChat = multer({
  storage: createStorage('chat'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.chat.maxSize }
}).single('image');

const uploadReview = multer({
  storage: createStorage('reviews'),
  fileFilter: createFileFilter('image'),
  limits: { fileSize: STORAGE_DIRS.reviews.maxSize }
}).single('image');

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
      req.file.storagePath = `/storage/${req.file.destination.split('/storage/')[1] || ''}`;
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
  uploadAvatar: createUploadMiddleware(uploadAvatar),
  uploadProduct: createUploadMiddleware(uploadProduct),
  uploadBanner: createUploadMiddleware(uploadBanner),
  uploadPromo: createUploadMiddleware(uploadPromo),
  uploadVoucher: createUploadMiddleware(uploadVoucher),
  uploadCategory: createUploadMiddleware(uploadCategory),
  uploadKTP: createUploadMiddleware(uploadKTP),
  uploadSelfie: createUploadMiddleware(uploadSelfie),
  uploadDocument: createUploadMiddleware(uploadDocument),
  uploadChat: createUploadMiddleware(uploadChat),
  uploadReview: createUploadMiddleware(uploadReview)
};