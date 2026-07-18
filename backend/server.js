require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameku';

// Connect to MongoDB with fallback to start server anyway
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Gameku API Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    startServer();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Starting server without MongoDB connection...');
    console.log('⚠️ Some features may not work without database connection.');
    startServer();
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error.message);
});
