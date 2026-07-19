const mongoose = require('mongoose');

const SalesHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID wajib diisi']
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID wajib diisi']
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID wajib diisi']
  },
  // Product snapshot at time of sale
  productName: {
    type: String,
    required: [true, 'Nama produk wajib diisi'],
    maxlength: [200, 'Nama produk terlalu panjang']
  },
  productSlug: {
    type: String,
    maxlength: [200, 'Slug produk terlalu panjang']
  },
  // Sale details
  quantity: {
    type: Number,
    required: [true, 'Quantity wajib diisi'],
    min: [1, 'Quantity minimal 1']
  },
  price: {
    type: Number,
    required: [true, 'Harga wajib diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Harga asli tidak boleh negatif']
  },
  // Commission for platform
  commission: {
    type: Number,
    default: 0,
    min: [0, 'Komisi tidak boleh negatif']
  },
  platformFee: {
    type: Number,
    default: 0,
    min: [0, 'Fee platform tidak boleh negatif']
  },
  // Total revenue for seller
  totalRevenue: {
    type: Number,
    required: [true, 'Total revenue wajib diisi'],
    min: [0, 'Total revenue tidak boleh negatif']
  },
  // Buyer info
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyerUsername: {
    type: String,
    maxlength: [100, 'Username buyer terlalu panjang']
  },
  // Status tracking
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'refunded', 'pending'],
    default: 'completed'
  },
  // Soft delete for admin recovery
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
SalesHistorySchema.index({ sellerId: 1, createdAt: -1 });
SalesHistorySchema.index({ productId: 1 });
SalesHistorySchema.index({ orderId: 1 });
SalesHistorySchema.index({ status: 1 });
SalesHistorySchema.index({ deletedAt: 1 });

// Prevent NoSQL injection
SalesHistorySchema.pre('validate', function(next) {
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

module.exports = mongoose.model('SalesHistory', SalesHistorySchema);