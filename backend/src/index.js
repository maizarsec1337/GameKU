/**
 * Backend Module Index
 * Ekspor semua module backend
 */

// TODO:
// Export semua module auth setelah diimplementasikan
// TODO:
// Export semua module security untuk Security Service

module.exports = {
  // Auth Service
  authService: require('./services/authService'),
  
  // Firebase Auth
  firebaseAuth: require('./auth/firebaseAuth'),
  
  // Firebase Provider
  firebaseProvider: require('./auth/firebaseProvider'),
  
  // Auth Middleware
  authMiddleware: require('./middleware/authMiddleware'),
  
  // Role Middleware
  roleMiddleware: require('./middleware/roleMiddleware'),
  
  // Token Helper
  tokenHelper: require('./utils/tokenHelper'),
  
  // Firebase Config
  firebaseConfig: require('./config/firebase'),
  
  // ====================
  // Security Service
  // ====================
  
  // Security Service Client
  securityClient: require('./security/client'),
  
  // Security Service Middleware
  securityMiddleware: require('./security/middleware'),
  
  // Security Service Gateway
  securityGateway: require('./security/gateway')
};
