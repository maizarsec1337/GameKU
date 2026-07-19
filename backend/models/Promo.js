const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Promo title is required'],
    maxlength: [200, 'Promo title too long']
  },
  // Image URL - stored in storage/promos
  image: {
    type: String,
    maxlength: [500, 'Image URL too long'],
    default: '/gambar/promo/flashsale.png'
  },
  discount: {
    type: Number,
    required: [true, 'Discount is required'],
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description too long']
  },
  expiredAt: {
    type: Date
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
PromoSchema.index({ active: 1 });
PromoSchema.index({ expiredAt: 1 });
PromoSchema.index({ deletedAt: 1 });

// Prevent NoSQL injection
PromoSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('Promo', PromoSchema);