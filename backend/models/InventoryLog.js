const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID wajib diisi']
  },
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'Inventory ID wajib diisi']
  },
  changeType: {
    type: String,
    enum: ['stock_in', 'stock_out', 'adjustment', 'sale', 'return', 'refund', 'reservation', 'release_reservation'],
    required: [true, 'Tipe perubahan wajib diisi']
  },
  // Quantity change amount (positive for stock_in, negative for stock_out)
  quantityChange: {
    type: Number,
    required: [true, 'Jumlah perubahan wajib diisi']
  },
  // Before and after values
  quantityBefore: {
    type: Number,
    required: [true, 'Quantity sebelumnya wajib diisi']
  },
  quantityAfter: {
    type: Number,
    required: [true, 'Quantity setelahnya wajib diisi']
  },
  // Reference to order if applicable
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  // Reason for change
  reason: {
    type: String,
    maxlength: [500, 'Alasan terlalu panjang']
  },
  // Who made the change
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // IP address for audit
  ipAddress: {
    type: String,
    maxlength: [45, 'IP address tidak valid']
  },
  // User agent for audit
  userAgent: {
    type: String,
    maxlength: [500, 'User agent terlalu panjang']
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes
InventoryLogSchema.index({ productId: 1, createdAt: -1 });
InventoryLogSchema.index({ changeType: 1 });
InventoryLogSchema.index({ changedBy: 1 });

// Prevent NoSQL injection
InventoryLogSchema.pre('validate', function(next) {
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

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);