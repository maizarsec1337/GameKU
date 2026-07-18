/**
 * Secure Cookie Middleware
 * Handles JWT token in HttpOnly cookies for production security
 */

const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

// Set token in secure cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, COOKIE_OPTIONS);
};

// Clear token cookie
const clearTokenCookie = (res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
};

// Verify and decode token from cookie or header
const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token || null;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Token refresh handling
const refreshToken = (req, res, next) => {
  if (req.user) {
    // Extend token expiration
    const newToken = jwt.sign(
      {
        uid: req.user.uid,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );
    
    setTokenCookie(res, newToken);
    req.newToken = newToken;
  }
  next();
};

// Logout all devices - requires storing refresh tokens in DB
const logoutAllDevices = async (req, res, next) => {
  // In production, this would invalidate all refresh tokens in DB
  // For now, just clear the current session
  clearTokenCookie(res);
  req.user = null;
  next();
};

module.exports = {
  setTokenCookie,
  clearTokenCookie,
  verifyToken,
  refreshToken,
  logoutAllDevices,
  COOKIE_OPTIONS
};