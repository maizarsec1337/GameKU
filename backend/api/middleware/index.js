/**
 * Middleware Index
 * Export semua middleware
 */

const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

module.exports = {
  authMiddleware,
  roleMiddleware
};