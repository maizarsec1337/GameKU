let bannerRoutes, categoryRoutes, gameRoutes, voucherRoutes, promoRoutes, searchRoutes, authRoutes, adminRoutes, resellerRoutes, uploadRoutes, homeRoutes;

try {
  bannerRoutes = require('./api/routes/banner');
} catch (error) {
  console.error('❌ Banner route import error:', error.message);
  bannerRoutes = express.Router();
}

try {
  categoryRoutes = require('./api/routes/category');
} catch (error) {
  console.error('❌ Category route import error:', error.message);
  categoryRoutes = express.Router();
}

try {
  gameRoutes = require('./api/routes/game');
} catch (error) {
  console.error('❌ Game route import error:', error.message);
  gameRoutes = express.Router();
}

try {
  voucherRoutes = require('./api/routes/voucher');
} catch (error) {
  console.error('❌ Voucher route import error:', error.message);
  voucherRoutes = express.Router();
}

try {
  promoRoutes = require('./api/routes/promo');
} catch (error) {
  console.error('❌ Promo route import error:', error.message);
  promoRoutes = express.Router();
}

try {
  searchRoutes = require('./api/routes/search');
} catch (error) {
  console.error('❌ Search route import error:', error.message);
  searchRoutes = express.Router();
}

try {
  authRoutes = require('./api/routes/auth');
} catch (error) {
  console.error('❌ Auth route import error:', error.message);
  authRoutes = express.Router();
}

try {
  adminRoutes = require('./api/routes/admin');
} catch (error) {
  console.error('❌ Admin route import error:', error.message);
  adminRoutes = express.Router();
}

try {
  resellerRoutes = require('./api/routes/reseller');
} catch (error) {
  console.error('❌ Reseller route import error:', error.message);
  resellerRoutes = express.Router();
}

try {
  uploadRoutes = require('./api/routes/upload');
} catch (error) {
  console.error('❌ Upload route import error:', error.message);
  uploadRoutes = express.Router();
}

try {
  homeRoutes = require('./api/routes/home');
} catch (error) {
  console.error('❌ Home route import error:', error.message);
  homeRoutes = express.Router();
}

// Apply general API rate limiting
app.use('/api/banner', apiRateLimiter, bannerRoutes);
app.use('/api/category', apiRateLimiter, categoryRoutes);
app.use('/api/game', apiRateLimiter, gameRoutes);
app.use('/api/voucher', apiRateLimiter, voucherRoutes);
app.use('/api/promo', apiRateLimiter, promoRoutes);
app.use('/api/search', apiRateLimiter, searchRoutes);
app.use('/api/admin', apiRateLimiter, adminRoutes);
app.use('/api/reseller', apiRateLimiter, resellerRoutes);
app.use('/api/upload', apiRateLimiter, uploadRoutes);
app.use('/api/home', apiRateLimiter, homeRoutes);

// Auth routes with login rate limiting
app.use('/api/auth', loginRateLimiter, authRoutes);
