const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

const app = express();

// ====================
// MIDDLEWARE
// ====================

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// API ROUTES
// ====================

const bannerRoutes = require('./api/routes/banner');
const categoryRoutes = require('./api/routes/category');
const gameRoutes = require('./api/routes/game');
const voucherRoutes = require('./api/routes/voucher');
const promoRoutes = require('./api/routes/promo');
const searchRoutes = require('./api/routes/search');
const authRoutes = require('./api/routes/auth');

app.use('/api/banner', bannerRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/voucher', voucherRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// ====================
// FRONTEND STATIC
// ====================

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ====================
// ERROR HANDLER
// ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;