const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    maxlength: [100, 'Product name too long']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    maxlength: [50, 'Slug too long']
  },
  category: {
    type: String,
    enum: ['topup', 'steam', 'giftcard', 'game', 'item', 'joki'],
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  // Image URL - stored in storage/products
  image: {
    type: String,
    maxlength: [500, 'Image URL too long'],
    default: '/gambar/logo/Gcard.png'
  },
  description: {
    type: String,
    maxlength: [2000, 'Description too long']
  },
  platform: {
    type: String,
    maxlength: [50, 'Platform too long']
  },
  region: {
    type: String,
    maxlength: [50, 'Region too long']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  // Reseller info
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sellerName: {
    type: String,
    maxlength: [100, 'Seller name too long']
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ slug: 1 });

// Sanitize string fields
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }
  if (this.isModified('slug')) {
    this.slug = this.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
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

module.exports = mongoose.model('Product', ProductSchema);