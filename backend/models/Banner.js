const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    maxlength: [200, 'Banner title too long']
  },
  // Image URL - stored in storage/banners
  image: {
    type: String,
    maxlength: [500, 'Image URL too long'],
    default: '/gambar/banner/hero1.png'
  },
  link: {
    type: String,
    maxlength: [500, 'Link URL too long']
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
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
BannerSchema.index({ active: 1 });
BannerSchema.index({ order: 1 });
BannerSchema.index({ deletedAt: 1 });

// Prevent NoSQL injection
BannerSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('Banner', BannerSchema);