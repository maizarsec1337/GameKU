const mongoose = require('mongoose');

const ProductViewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID wajib diisi']
  },
  viewerIp: {
    type: String,
    maxlength: [45, 'IP address tidak valid']
  },
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userAgent: {
    type: String,
    maxlength: [500, 'User agent terlalu panjang']
  },
  referer: {
    type: String,
    maxlength: [500, 'Referer terlalu panjang']
  },
  // View duration in seconds
  viewDuration: {
    type: Number,
    default: 0,
    min: [0, 'Durasi view tidak valid']
  },
  // Converted to purchase (true if purchased after view)
  converted: {
    type: Boolean,
    default: false
  },
  // Source of view (direct, search, category, home, etc)
  source: {
    type: String,
    enum: ['direct', 'search', 'category', 'home', 'store', 'promo', 'wishlist'],
    default: 'direct'
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
ProductViewSchema.index({ productId: 1, createdAt: -1 });
ProductViewSchema.index({ viewerId: 1 });
ProductViewSchema.index({ converted: 1 });

// Prevent NoSQL injection
ProductViewSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('ProductView', ProductViewSchema);