import axios from 'axios';

// TODO: Generate security headers untuk mencegah replay attack
// const generateSecurityHeaders = () => {
//   return {
//     'X-Timestamp': Math.floor(Date.now() / 1000),
//     'X-Nonce': crypto.randomUUID(),
//     'X-Signature': await generateSignature(JSON.stringify(data), secretKey)
//   };
// };

// Create axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based session
});

// Request interceptor for adding token if available
// TODO: Implementasi Request Signature
// TODO: Implementasi Timestamp Validation
// TODO: Implementasi Nonce Validation
api.interceptors.request.use(
  (config) => {
    // TODO: Tambahkan security headers
    // const timestamp = Math.floor(Date.now() / 1000);
    // const nonce = crypto.randomUUID();
    // config.headers['X-Timestamp'] = timestamp;
    // config.headers['X-Nonce'] = nonce;
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API endpoints
export const authAPI = {
  // Register - standard registration
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login - email & password
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Google login - redirects to backend
  googleLogin: async () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  },

  // Google callback handler
  googleCallback: async () => {
    const response = await api.get('/auth/google/callback');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  // Get current user
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Register reseller
  registerReseller: async (data) => {
    const formData = new FormData();
    formData.append('ktp_photo', data.ktp_photo);
    formData.append('selfie_with_ktp', data.selfie_with_ktp);
    formData.append('bank_account', data.bank_account);
    formData.append('account_holder_name', data.account_holder_name);

    const response = await api.post('/auth/reseller', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get reseller status
  getResellerStatus: async () => {
    const response = await api.get('/auth/reseller/status');
    return response.data;
  },
};

export default api;