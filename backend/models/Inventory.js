const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID wajib diisi'],
    unique: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity wajib diisi'],
    default: 0,
    min: [0, 'Quantity tidak boleh negatif']
  },
  reserved: {
    type: Number,
    default: 0,
    min: [0, 'Reserved tidak boleh negatif']
  },
  sku: {
    type: String,
    maxlength: [100, 'SKU terlalu panjang'],
    unique: true,
    sparse: true
  },
  // Low stock threshold
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Minimal threshold 0']
  },
  // Track last stock update
  lastStockUpdate: {
    type: Date,
    default: Date.now
  },
  // Track who updated stock
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['available', 'sold_out', 'discontinued'],
    default: 'available'
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
InventorySchema.index({ status: 1 });

// Generate SKU if not provided
InventorySchema.pre('validate', function(next) {
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.sku = `SKU-${timestamp}-${random}`;
  }
  next();
});

// Prevent NoSQL injection
InventorySchema.pre('validate', function(next) {
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

// Virtual for available stock
InventorySchema.virtual('availableStock').get(function() {
  return Math.max(0, this.quantity - this.reserved);
});

// Check if stock is low
InventorySchema.methods.isLowStock = function() {
  return this.availableStock <= this.lowStockThreshold && this.availableStock > 0;
};

// Check if sold out
InventorySchema.methods.isSoldOut = function() {
  return this.availableStock <= 0;
};

module.exports = mongoose.model('Inventory', InventorySchema);