require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('./app');

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gameku';
const SERVER_PID = process.pid;

// Initialize storage directories
const STORAGE_BASE = path.join(__dirname, '..', 'storage');
const STORAGE_DIRS = [
  'profile', 'avatars', 'reseller', 'ktp', 'selfie', 
  'store', 'product', 'products', 'banner', 'banners', 
  'category', 'categories', 'voucher', 'vouchers', 
  'promo', 'promos', 'giftcards', 'chat', 'review',
  'reviews', 'documents', 'games', 'temp', 'deleted', 'logs',
  'users'
];

// Detect port in use
const checkPortInUse = () => {
  const net = require('net');
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') resolve(true);
        else resolve(false);
      })
      .once('close', () => resolve(false))
      .listen(PORT, () => tester.close());
  });
};

const initializeStorageDirs = () => {
  try {
    if (!fs.existsSync(STORAGE_BASE)) {
      fs.mkdirSync(STORAGE_BASE, { recursive: true });
      console.log('✓ Storage directory created');
    }
    STORAGE_DIRS.forEach(dir => {
      const dirPath = path.join(STORAGE_BASE, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Upload Storage Ready: storage/${dir}`);
      }
    });
    console.log('✓ Upload Storage Ready');
    return true;
  } catch (error) {
    console.error('❌ Storage initialization error:', error.message);
    return false;
  }
};

// Connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB Connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Starting server without MongoDB connection...');
    return false;
  }
};

// Start server
const startServer = async () => {
  // Check port availability
  const portInUse = await checkPortInUse();
  if (portInUse) {
    console.error(`❌ Port ${PORT} already in use!`);
    console.error('Please kill the existing process or use a different port.');
    process.exit(1);
  }

  // Initialize storage
  initializeStorageDirs();
  
  // Check auth system
  console.log('✓ Authentication ready (JWT + MongoDB)');

  // Start HTTP server
  app.listen(PORT, () => {
    console.log('===================================');
    console.log('🚀 Backend PID:', SERVER_PID);
    console.log('📍 Port:', PORT);
    console.log('📦 Mongo:', MONGODB_URI);
    console.log('📁 Storage:', path.join(STORAGE_BASE));
    console.log('🔑 JWT:', process.env.JWT_SECRET ? 'Configured' : 'Missing');
    console.log('📝 Mode:', process.env.NODE_ENV || 'development');
    console.log('✓ API Ready on http://127.0.0.1:' + PORT);
    console.log('===================================');
  });
};

// Start product scheduler for automatic publishing
const startScheduler = async () => {
  try {
    const productScheduler = require('./api/services/productScheduler');
    productScheduler.startScheduler();
  } catch (error) {
    console.error('Schedule error:', error.message);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
startServer();
connectMongoDB();
startScheduler();