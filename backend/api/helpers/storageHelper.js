const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage base directory
const STORAGE_BASE = path.join(__dirname, '..', '..', '..', 'storage');

// Storage directories configuration
const STORAGE_DIRS = {
  products: { maxSize: 5 * 1024 * 1024 }, // 5MB
  users: { maxSize: 5 * 1024 * 1024 }, // 5MB
  reseller: { maxSize: 5 * 1024 * 1024 }, // 5MB
  ktp: { maxSize: 5 * 1024 * 1024 }, // 5MB
  selfie: { maxSize: 5 * 1024 * 1024 }, // 5MB
  documents: { maxSize: 10 * 1024 * 1024 }, // 10MB
  avatars: { maxSize: 2 * 1024 * 1024 }, // 2MB
  banners: { maxSize: 10 * 1024 * 1024 }, // 10MB
  promos: { maxSize: 10 * 1024 * 1024 }, // 10MB
  vouchers: { maxSize: 2 * 1024 * 1024 }, // 2MB
  categories: { maxSize: 5 * 1024 * 1024 }, // 5MB
  chat: { maxSize: 5 * 1024 * 1024 }, // 5MB
  reviews: { maxSize: 5 * 1024 * 1024 }, // 5MB
  temporary: { maxSize: 10 * 1024 * 1024 } // 10MB
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  document: ['application/pdf']
};

// Allowed extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

// Dangerous extensions to reject
const DANGEROUS_EXTENSIONS = ['.svg', '.php', '.js', '.html', '.exe', '.sh', '.bat', '.cmd', '.ps1'];

// Initialize storage directories
const initializeStorage = () => {
  Object.keys(STORAGE_DIRS).forEach(dir => {
    const dirPath = path.join(STORAGE_BASE, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Generate unique filename
const generateUniqueFilename = (originalName, type = 'image') => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0];
  return `${uuid}-${timestamp}${ext}`;
};

// Sanitize filename - remove dangerous characters
const sanitizeFilename = (filename) => {
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  return sanitized;
};

// Validate file extension
const validateExtension = (filename, type = 'image') => {
  const ext = path.extname(filename).toLowerCase();
  
  // Check dangerous extensions first
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `File dengan ekstensi ${ext} tidak diizinkan` };
  }
  
  // Check allowed extensions
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Ekstensi file ${ext} tidak diizinkan` };
  }
  
  // For documents, only allow PDF
  if (type === 'document' && ext !== '.pdf') {
    return { valid: false, error: 'File dokumen hanya boleh PDF' };
  }
  
  // For images, reject PDF
  if (type === 'image' && ext === '.pdf') {
    return { valid: false, error: 'File gambar tidak boleh PDF' };
  }
  
  return { valid: true };
};

// Validate MIME type
const validateMimeType = (mimetype, type = 'image') => {
  const allowedTypes = type === 'document' ? ALLOWED_MIME_TYPES.document : ALLOWED_MIME_TYPES.image;
  
  if (!allowedTypes.includes(mimetype)) {
    return { valid: false, error: `Tipe file ${mimetype} tidak diizinkan` };
  }
  
  return { valid: true };
};

// Validate file size
const validateFileSize = (size, maxSize) => {
  if (size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `Ukuran file terlalu besar (maksimal ${maxSizeMB}MB)` };
  }
  return { valid: true };
};

// Get storage path
const getStoragePath = (type) => {
  return path.join(STORAGE_BASE, type);
};

// Save file to storage
const saveFile = async (file, type, subtype = null) => {
  try {
    // Initialize storage if needed
    initializeStorage();
    
    const storageType = subtype || type;
    const config = STORAGE_DIRS[storageType];
    
    if (!config) {
      throw new Error(`Tipe storage ${storageType} tidak dikenal`);
    }
    
    // Validate file
    const extValidation = validateExtension(file.originalname, type);
    if (!extValidation.valid) {
      throw new Error(extValidation.error);
    }
    
    const mimeValidation = validateMimeType(file.mimetype, type);
    if (!mimeValidation.valid) {
      throw new Error(mimeValidation.error);
    }
    
    const sizeValidation = validateFileSize(file.size, config.maxSize);
    if (!sizeValidation.valid) {
      throw new Error(sizeValidation.error);
    }
    
    // Generate unique filename
    const safeName = sanitizeFilename(file.originalname);
    const uniqueName = generateUniqueFilename(safeName, type);
    
    // Create destination path
    const destPath = path.join(STORAGE_BASE, storageType, uniqueName);
    
    // Write file (for multer storage)
    if (file.buffer) {
      fs.writeFileSync(destPath, file.buffer);
    } else if (file.path) {
      // Move file from temp location
      fs.copyFileSync(file.path, destPath);
      fs.unlinkSync(file.path);
    }
    
    // Return relative path for database storage
    return `/storage/${storageType}/${uniqueName}`;
  } catch (error) {
    // Clean up temp file if exists
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

// Delete file from storage
const deleteFile = async (relativePath) => {
  try {
    if (!relativePath || !relativePath.startsWith('/storage/')) return;
    
    const fullPath = path.join(__dirname, '..', '..', '..', relativePath);
    
    // Security: prevent path traversal
    const normalizedPath = path.normalize(fullPath);
    if (!normalizedPath.startsWith(STORAGE_BASE)) {
      throw new Error('Path traversal attempt detected');
    }
    
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
    }
  } catch (error) {
    console.error('Delete file error:', error.message);
  }
};

// Get file path (for serving)
const getFilePath = (relativePath) => {
  if (!relativePath || !relativePath.startsWith('/storage/')) return null;
  
  const fullPath = path.join(__dirname, '..', '..', '..', relativePath);
  const normalizedPath = path.normalize(fullPath);
  
  if (normalizedPath.startsWith(STORAGE_BASE) && fs.existsSync(normalizedPath)) {
    return normalizedPath;
  }
  
  return null;
};

module.exports = {
  STORAGE_BASE,
  STORAGE_DIRS,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  DANGEROUS_EXTENSIONS,
  initializeStorage,
  generateUniqueFilename,
  sanitizeFilename,
  validateExtension,
  validateMimeType,
  validateFileSize,
  getStoragePath,
  saveFile,
  deleteFile,
  getFilePath
};