const mongoose = require('mongoose');

const SearchIndexSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID wajib diisi']
  },
  // Searchable fields combined
  searchKeywords: {
    type: String,
    required: [true, 'Keywords pencarian wajib diisi'],
    maxlength: [1000, 'Keywords terlalu panjang']
  },
  // Original product name
  productName: {
    type: String,
    maxlength: [200, 'Nama produk terlalu panjang']
  },
  // Slug
  slug: {
    type: String,
    maxlength: [200, 'Slug terlalu panjang']
  },
  // Category info
  categoryName: {
    type: String,
    maxlength: [100, 'Nama kategori terlalu panjang']
  },
  categoryType: {
    type: String,
    enum: ['topup', 'steam', 'giftcard', 'game', 'randomkey', 'item', 'joki', 'voucher']
  },
  // Tag names combined
  tags: [{
    type: String,
    maxlength: [50, 'Tag terlalu panjang']
  }],
  // Brand/Game
  brand: {
    type: String,
    maxlength: [100, 'Brand terlalu panjang']
  },
  // Seller info
  sellerName: {
    type: String,
    maxlength: [100, 'Nama seller terlalu panjang']
  },
  // Search ranking score
  rankingScore: {
    type: Number,
    default: 0
  },
  // Popularity score based on views/purchases
  popularityScore: {
    type: Number,
    default: 0
  },
  // Trending score
  trendingScore: {
    type: Number,
    default: 0
  },
  // Search count
  searchCount: {
    type: Number,
    default: 0
  },
  // Last searched timestamp
  lastSearched: {
    type: Date,
    default: Date.now
  },
  // Status
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
SearchIndexSchema.index({ searchKeywords: 'text' });
SearchIndexSchema.index({ productId: 1 });
SearchIndexSchema.index({ rankingScore: -1 });
SearchIndexSchema.index({ trendingScore: -1 });
SearchIndexSchema.index({ popularityScore: -1 });

// Prevent NoSQL injection
SearchIndexSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('SearchIndex', SearchIndexSchema);