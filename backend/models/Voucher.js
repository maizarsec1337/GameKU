const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Voucher code is required'],
    unique: true,
    maxlength: [50, 'Voucher code too long']
  },
  discount: {
    type: Number,
    required: [true, 'Discount is required'],
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  // Image URL - stored in storage/vouchers
  image: {
    type: String,
    maxlength: [500, 'Image URL too long'],
    default: '/gambar/voucher/googleplay.png'
  },
  active: {
    type: Boolean,
    default: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  expiredAt: {
    type: Date
  },
  limitPerUser: {
    type: Number,
    default: 1
  },
  limitTotal: {
    type: Number,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
VoucherSchema.index({ active: 1 });
VoucherSchema.index({ expiredAt: 1 });
VoucherSchema.index({ deletedAt: 1 });

// Prevent NoSQL injection
VoucherSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('Voucher', VoucherSchema);