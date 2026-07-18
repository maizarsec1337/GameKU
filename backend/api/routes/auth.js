const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  googleLogin, 
  googleCallback, 
  logout, 
  getMe, 
  forgotPassword, 
  resetPassword,
  registerReseller,
  getResellerStatus
} = require('../controllers/authController');

// TODO:
// Import middleware authMiddleware untuk route protection

// Route untuk registrasi
router.post('/register', register);

// Route untuk login
router.post('/login', login);

// Route untuk Firebase Google Login
router.post('/google', googleLogin);
// Legacy route - redirect to Firebase flow
router.get('/google', (req, res) => {
  res.redirect(`${process.env.CORS_ORIGIN}/login`);
});
router.get('/google/callback', googleCallback);

// Route untuk logout
router.post('/logout', logout);

// Route untuk mendapatkan user yang sedang login
router.get('/me', getMe);

// Route untuk forgot password
router.post('/forgot-password', forgotPassword);

// Route untuk reset password
router.post('/reset-password', resetPassword);

// Route untuk reseller
router.post('/reseller', registerReseller);
router.get('/reseller/status', getResellerStatus);

module.exports = router;
