const mongoose = require('mongoose');

const SellerStatisticsSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID wajib diisi'],
    unique: true
  },
  date: {
    type: Date,
    required: [true, 'Tanggal wajib diisi']
  },
  // Product stats
  totalProducts: {
    type: Number,
    default: 0,
    min: [0, 'Total produk tidak boleh negatif']
  },
  activeProducts: {
    type: Number,
    default: 0,
    min: [0, 'Produk aktif tidak boleh negatif']
  },
  soldOutProducts: {
    type: Number,
    default: 0,
    min: [0, 'Produk sold out tidak boleh negatif']
  },
  inactiveProducts: {
    type: Number,
    default: 0,
    min: [0, 'Produk nonaktif tidak boleh negatif']
  },
  // Sales stats
  totalSales: {
    type: Number,
    default: 0,
    min: [0, 'Total penjualan tidak boleh negatif']
  },
  dailyRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue harian tidak boleh negatif']
  },
  monthlyRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue bulanan tidak boleh negatif']
  },
  yearlyRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue tahunan tidak boleh negatif']
  },
  // Viewer stats
  totalViews: {
    type: Number,
    default: 0,
    min: [0, 'Total views tidak boleh negatif']
  },
  dailyViews: {
    type: Number,
    default: 0,
    min: [0, 'Views harian tidak boleh negatif']
  },
  // Wishlist stats
  totalWishlist: {
    type: Number,
    default: 0,
    min: [0, 'Total wishlist tidak boleh negatif']
  },
  // Conversion rate
  conversionRate: {
    type: Number,
    default: 0,
    min: [0, 'Conversion rate tidak boleh negatif'],
    max: [100, 'Conversion rate maksimal 100']
  },
  // Best selling product
  bestSellingProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  bestSellingProductName: {
    type: String,
    maxlength: [200, 'Nama produk terlalu panjang']
  },
  // Best selling category
  bestSellingCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  },
  bestSellingCategoryName: {
    type: String,
    maxlength: [100, 'Nama kategori terlalu panjang']
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
SellerStatisticsSchema.index({ sellerId: 1, date: 1 });
SellerStatisticsSchema.index({ dailyRevenue: -1 });

// Prevent NoSQL injection
SellerStatisticsSchema.pre('validate', function(next) {
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

// Get or create today's statistics
SellerStatisticsSchema.statics.getTodayStats = async function(sellerId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const stats = await this.findOne({ sellerId, date: today });
  
  if (!stats) {
    return await this.create({ sellerId, date: today });
  }
  
  return stats;
};

module.exports = mongoose.model('SellerStatistics', SellerStatisticsSchema);