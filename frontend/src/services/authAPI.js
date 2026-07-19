import axios from 'axios';

// Create axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based session
});

// Request interceptor for adding token if available
api.interceptors.request.use(
  (config) => {
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

  // Google login - redirect to backend OAuth
  googleLogin: () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = '/api/auth/google';
  },

  // Google callback handler (for token from backend redirect)
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

  // Dashboard reseller stats
  getResellerStats: async () => {
    const response = await api.get('/reseller/dashboard/stats');
    return response.data;
  },

  // Reseller store info
  getStore: async () => {
    const response = await api.get('/reseller/store');
    return response.data;
  },

  updateStore: async (data) => {
    const response = await api.put('/reseller/store', data);
    return response.data;
  },

  // Reseller products
  resellerProducts: async () => {
    const response = await api.get('/reseller/products');
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post('/reseller/products', data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/reseller/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/reseller/products/${id}`);
    return response.data;
  },

  // Reseller orders
  resellerOrders: async () => {
    const response = await api.get('/reseller/orders');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/reseller/orders/${id}`, { status });
    return response.data;
  },

  // Reseller stock
  resellerStock: async () => {
    const response = await api.get('/reseller/stock');
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await api.put(`/reseller/stock/${id}`, { stock });
    return response.data;
  },

  // Reseller withdraw
  createWithdraw: async (data) => {
    const response = await api.post('/reseller/withdraw', data);
    return response.data;
  },

  resellerWithdraws: async () => {
    const response = await api.get('/reseller/withdraw');
    return response.data;
  },
};

export default api;