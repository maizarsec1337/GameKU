const express = require('express');
const router = express.Router();
const { register, login, googleLogin, logout, getUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/user', getUser);

module.exports = router;