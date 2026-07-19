const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: [true, 'Nama produk wajib diisi'],
    maxlength: [200, 'Nama produk terlalu panjang']
  },
  slug: {
    type: String,
    required: [true, 'Slug wajib diisi'],
    unique: true,
    maxlength: [200, 'Slug terlalu panjang'],
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [5000, 'Deskripsi terlalu panjang']
  },
  
  // Category & Sub Category
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: [true, 'Kategori wajib diisi']
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null
  },
  // Legacy category field for backward compatibility
  category: {
    type: String,
    enum: ['topup', 'steam', 'giftcard', 'game', 'randomkey', 'item', 'joki', 'voucher']
  },
  categoryType: {
    type: String,
    enum: ['digital', 'physical'],
    default: 'digital'
  },
  
  // Price
  price: {
    type: Number,
    required: [true, 'Harga wajib diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Harga coret tidak boleh negatif'],
    default: null
  },
  // Wholesale/minimum order
  minOrder: {
    type: Number,
    default: 1,
    min: [1, 'Minimal order 1']
  },
  
  // Stock - managed by Inventory model
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stok tidak boleh negatif']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold_out', 'draft', 'deleted'],
    default: 'active',
    index: true
  },
  
  // SKU
  sku: {
    type: String,
    maxlength: [100, 'SKU terlalu panjang'],
    unique: true,
    sparse: true
  },
  
  // Weight for physical products
  weight: {
    type: Number,
    default: 0,
    min: [0, 'Berat tidak boleh negatif']
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'gram', 'lb', 'oz'],
    default: 'gram'
  },
  
  // Condition
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new'
  },
  
  // Brand/Game
  brand: {
    type: String,
    maxlength: [100, 'Brand terlalu panjang']
  },
  
  // Auto delivery for digital products
  autoDelivery: {
    type: Boolean,
    default: false
  },
  deliveryText: {
    type: String,
    maxlength: [1000, 'Teks delivery terlalu panjang']
  },
  
  // Warranty
  warranty: {
    type: Boolean,
    default: false
  },
  warrantyPeriod: {
    type: String,
    maxlength: [50, 'Periode garansi terlalu panjang']
  },
  
  // Seller info
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID wajib diisi']
  },
  sellerName: {
    type: String,
    maxlength: [100, 'Nama seller terlalu panjang']
  },
  storeName: {
    type: String,
    maxlength: [100, 'Nama toko terlalu panjang']
  },
  
  // Tags - array of tag IDs
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductTag'
  }],
  tagNames: [{
    type: String,
    maxlength: [50, 'Tag terlalu panjang']
  }],
  
  // Statistics
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count tidak boleh negatif']
  },
  purchaseCount: {
    type: Number,
    default: 0,
    min: [0, 'Purchase count tidak boleh negatif']
  },
  wishlistCount: {
    type: Number,
    default: 0,
    min: [0, 'Wishlist count tidak boleh negatif']
  },
  
  // Rating
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating minimal 0'],
    max: [5, 'Rating maksimal 5']
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: [0, 'Rating count tidak boleh negatif']
  },
  
  // SEO
  metaTitle: {
    type: String,
    maxlength: [200, 'Meta title terlalu panjang']
  },
  metaDescription: {
    type: String,
    maxlength: [500, 'Meta description terlalu panjang']
  },
  
  // Soft delete
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Timestamps for tracking
  publishedAt: {
    type: Date,
    default: null
  },
  lastStockUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes - optimized untuk query utama
ProductSchema.index({ slug: 1 }, { unique: true }); // Query by slug
ProductSchema.index({ categoryId: 1, status: 1, deletedAt: 1 }); // Query by category + status
ProductSchema.index({ category: 1, status: 1, deletedAt: 1 }); // Query by category string
ProductSchema.index({ sellerId: 1, status: 1, deletedAt: 1 }); // Query by seller + status
ProductSchema.index({ status: 1, deletedAt: 1, createdAt: -1 }); // Sort by date + filter status
ProductSchema.index({ createdAt: -1 }); // Sort by date
ProductSchema.index({ viewCount: -1 }); // Popular products
ProductSchema.index({ purchaseCount: -1 }); // Best selling
ProductSchema.index({ '$**': 'text' }, { default_language: 'english' }); // Full text search

// Generate slug from name if not provided
ProductSchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  // Generate SKU if not provided
  if (!this.sku && this.category) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.sku = `${this.category.toUpperCase()}-${timestamp}-${random}`;
  }
  
  // Set category type based on product category
  if (this.category === 'physical' || this.category === 'item') {
    this.categoryType = 'physical';
  }
  
  // Update status to sold_out if stock becomes 0
  if (this.stock === 0 && this.status === 'active') {
    this.status = 'sold_out';
  }
  
  next();
});

// Sanitize string fields
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }
  next();
});

// Prevent NoSQL injection
ProductSchema.pre('validate', function(next) {
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

// Virtual for product images
ProductSchema.virtual('images', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'productId',
  match: { imageType: 'gallery' }
});

// Virtual for thumbnail
ProductSchema.virtual('thumbnail', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'productId',
  justOne: true,
  match: { imageType: 'thumbnail' }
});

module.exports = mongoose.model('Product', ProductSchema);