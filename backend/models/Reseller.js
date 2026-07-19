const mongoose = require('mongoose');
const validator = require('validator');

const ResellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    maxlength: [100, 'Full name too long'],
    trim: true
  },
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    maxlength: [100, 'Store name too long'],
    trim: true
  },
  storeUsername: {
    type: String,
    required: [true, 'Store username is required'],
    unique: true,
    maxlength: [50, 'Store username too long'],
    match: [/^[a-zA-Z0-9_]+$/, 'Store username can only contain letters, numbers, and underscores'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    validate: {
      validator: function(v) {
        return /^08[0-9]{8,12}$/.test(v);
      },
      message: 'Invalid phone format (must start with 08 and 9-12 digits total)'
    },
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    maxlength: [100, 'Province name too long'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    maxlength: [100, 'City name too long'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    maxlength: [100, 'District name too long'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    maxlength: [500, 'Address too long'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    maxlength: [10, 'Postal code too long'],
    trim: true
  },
  ktpImage: {
    type: String,
    required: [true, 'KTP image is required'],
    maxlength: [500, 'KTP image path too long']
  },
  selfieImage: {
    type: String,
    required: [true, 'Selfie image is required'],
    maxlength: [500, 'Selfie image path too long']
  },
  storeLogo: {
    type: String,
    maxlength: [500, 'Store logo path too long'],
    default: '/gambar/logo/default-store.png'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason too long']
  }
}, {
  timestamps: true,
  minimize: true
});

// Indexes for performance
ResellerSchema.index({ verificationStatus: 1 });
ResellerSchema.index({ status: 1 });

// Sanitize string fields
ResellerSchema.pre('save', function(next) {
  if (this.isModified('phone')) {
    this.phone = this.phone.replace(/\D/g, '');
  }
  if (this.isModified('postalCode')) {
    this.postalCode = this.postalCode.replace(/\D/g, '');
  }
  next();
});

module.exports = mongoose.model('Reseller', ResellerSchema);