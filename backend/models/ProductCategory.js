const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama kategori wajib diisi'],
    maxlength: [100, 'Nama kategori terlalu panjang'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug wajib diisi'],
    unique: true,
    maxlength: [50, 'Slug terlalu panjang'],
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Deskripsi terlalu panjang']
  },
  icon: {
    type: String,
    maxlength: [10, 'Icon terlalu panjang']
  },
  image: {
    type: String,
    maxlength: [500, 'URL gambar terlalu panjang']
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level minimal 0']
  },
  order: {
    type: Number,
    default: 0
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  // Auto delivery settings for digital products
  autoDelivery: {
    type: Boolean,
    default: false
  },
  // Type of category (topup, steam, giftcard, game, randomkey)
  categoryType: {
    type: String,
    enum: ['topup', 'steam', 'giftcard', 'game', 'randomkey', 'item', 'joki', 'voucher'],
    required: [true, 'Tipe kategori wajib diisi']
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes - optimized untuk query utama
ProductCategorySchema.index({ slug: 1 }, { unique: true }); // Query by slug
ProductCategorySchema.index({ categoryType: 1, deletedAt: 1 }); // Query by type
ProductCategorySchema.index({ parentCategory: 1 });
ProductCategorySchema.index({ status: 1, deletedAt: 1 }); // Query by status
ProductCategorySchema.index({ sortOrder: 1 });
ProductCategorySchema.index({ order: 1 });
ProductCategorySchema.index({ deletedAt: 1 });
ProductCategorySchema.index({ active: 1, deletedAt: 1 }); // For active categories query

// Generate slug from name if not provided
ProductCategorySchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Prevent NoSQL injection
ProductCategorySchema.pre('validate', function(next) {
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

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);