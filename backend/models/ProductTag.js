const mongoose = require('mongoose');

const ProductTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama tag wajib diisi'],
    maxlength: [50, 'Nama tag terlalu panjang'],
    unique: true,
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
  color: {
    type: String,
    default: '#4F46E5',
    maxlength: [7, 'Warna tidak valid']
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
ProductTagSchema.index({ status: 1 });

// Generate slug from name if not provided
ProductTagSchema.pre('validate', function(next) {
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
ProductTagSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('ProductTag', ProductTagSchema);