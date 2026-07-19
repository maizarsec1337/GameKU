const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'UID is required'],
    unique: true,
    maxlength: [128, 'UID too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format'
    },
    maxlength: [255, 'Email too long']
  },
  fullName: {
    type: String,
    maxlength: [100, 'Full name too long'],
    default: ''
  },
  username: {
    type: String,
    maxlength: [50, 'Username too long'],
    default: ''
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^08[0-9]{8,12}$/.test(v);
      },
      message: 'Invalid phone format'
    }
  },
  role: {
    type: String,
    enum: ['user', 'reseller', 'admin', 'super_admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  // PhotoURL for Google OAuth profile picture
  photoURL: {
    type: String,
    maxlength: [500, 'Photo URL too long'],
    default: '/gambar/avatar/default.png'
  },
  // Avatar URL - stored in storage/avatars
  avatar: {
    type: String,
    maxlength: [500, 'Avatar URL too long'],
    default: '/gambar/avatar/default.png'
  },
  // Reseller fields
  resellerInfo: {
    bankAccount: {
      type: String,
      maxlength: [50, 'Bank account too long']
    },
    accountHolderName: {
      type: String,
      maxlength: [100, 'Account holder name too long']
    },
    storeName: {
      type: String,
      maxlength: [100, 'Store name too long']
    },
    // KYC fields - stored in storage/ktp and storage/selfie
    ktpPhoto: {
      type: String,
      maxlength: [500, 'KTP photo URL too long']
    },
    selfieWithKtp: {
      type: String,
      maxlength: [500, 'Selfie photo URL too long']
    },
    // KYC status
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    // KYC document - stored in storage/documents
    kycDocument: {
      type: String,
      maxlength: [500, 'KYC document URL too long']
    },
    resellerStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  // Security fields
  password: {
    type: String,
    maxlength: [255, 'Password too long']
  },
  lastLoginAt: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  minimize: true
});

// Indexes for performance
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

// Prevent NoSQL injection by casting
UserSchema.pre('validate', function(next) {
  const dangerousOperators = ['$where', '$expr', '$ne', '$gt', '$gte', '$lt', '$lte'];
  
  const checkObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (dangerousOperators.includes(key)) {
        this.invalidate(key, 'Invalid operator detected');
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        checkObject(obj[key]);
      }
    }
  };
  
  checkObject(this.toObject());
  next();
});

// Sanitize string fields
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.isModified('fullName')) {
    this.fullName = this.fullName.trim();
  }
  if (this.isModified('phone')) {
    this.phone = this.phone.replace(/\D/g, '');
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);