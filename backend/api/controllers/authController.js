// DATABASE BELUM DIBUAT
// Firebase Authentication belum diimplementasikan
// Belum perlu implementasi login/register
// Belum perlu route protection

// TODO:
// Integrasi Firebase Authentication nanti.
// Integrasi Midtrans nanti.

const register = (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint register - Firebase Auth belum diimplementasikan'
  });
};

const login = (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint login - Firebase Auth belum diimplementasikan'
  });
};

const googleLogin = (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint Google login - Firebase Auth belum diimplementasikan'
  });
};

const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint logout - Firebase Auth belum diimplementasikan'
  });
};

const getUser = (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint get user - Firebase Auth belum diimplementasikan',
    data: null
  });
};

module.exports = { register, login, googleLogin, logout, getUser };