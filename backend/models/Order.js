const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    maxlength: [100, 'Product name too long']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity must be at least 1']
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'diproses', 'selesai', 'dibatalkan', 'refund'],
    default: 'pending'
  },
  // Payment info
  paymentMethod: {
    type: String,
    enum: ['bank', 'ewallet', 'qris'],
    default: 'bank'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  // Game account info
  gameAccountId: {
    type: String,
    maxlength: [100, 'Game account ID too long']
  },
  // For reseller orders
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commission: {
    type: Number,
    default: 0,
    min: [0, 'Commission cannot be negative']
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, status: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Prevent NoSQL injection
OrderSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('Order', OrderSchema);