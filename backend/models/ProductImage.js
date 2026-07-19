const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID wajib diisi']
  },
  imageType: {
    type: String,
    enum: ['thumbnail', 'gallery', 'video'],
    required: [true, 'Tipe gambar wajib diisi']
  },
  // For gallery, store position/order
  position: {
    type: Number,
    default: 0,
    min: [0, 'Posisi minimal 0']
  },
  // Storage path
  path: {
    type: String,
    required: [true, 'Path gambar wajib diisi'],
    maxlength: [500, 'Path gambar terlalu panjang']
  },
  // Thumbnail version path
  thumbnail: {
    type: String,
    maxlength: [500, 'Path thumbnail terlalu panjang']
  },
  // Alt text for SEO
  alt: {
    type: String,
    maxlength: [200, 'Alt text terlalu panjang']
  },
  // For video
  duration: {
    type: Number,
    default: 0,
    min: [0, 'Durasi tidak valid']
  },
  // Original filename before rename
  originalName: {
    type: String,
    maxlength: [255, 'Nama file asli terlalu panjang']
  },
  // File size in bytes
  size: {
    type: Number,
    default: 0,
    min: [0, 'Ukuran file tidak valid']
  },
  // MIME type
  mimeType: {
    type: String,
    maxlength: [100, 'MIME type tidak valid']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
ProductImageSchema.index({ productId: 1, imageType: 1 });
ProductImageSchema.index({ productId: 1, position: 1 });
ProductImageSchema.index({ path: 1 });

// Prevent NoSQL injection
ProductImageSchema.pre('validate', function(next) {
  const dangerousOperators = ['$where', '$expr', '$ne', '$gt', '$gte', '$lt', '$lte'];
  
  const checkObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (dangerousOperators.includes(key)) {
        this.invalidate(key, 'Invalid operator detected');
      }
      if (typeof obj[key] === 'object') {
        checkObject(obj[key]);
      }
    }
  };
  
  checkObject(this.toObject());
  next();
});

module.exports = mongoose.model('ProductImage', ProductImageSchema);