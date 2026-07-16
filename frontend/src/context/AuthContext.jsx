/**
 * Auth Context
 * Context untuk manajemen state autentikasi di frontend
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

// Create auth context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile saat aplikasi dimuat
  useEffect(() => {
    checkAuth();
  }, []);

  // TODO:
  // Session Management.

  // TODO:
  // Refresh Token Flow (placeholder).

  // Cek status autentikasi
  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await authAPI.me();
      if (response.success) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat login';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // TODO:
  // Google Login Flow.

  // Google Login - redirect ke backend
  const googleLogin = () => {
    authAPI.googleLogin();
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      // Tetap hapus user di frontend meskipun backend error
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // TODO:
  // Error Handling.

  // Refresh session
  const refreshSession = async () => {
    // TODO: Refresh Token Flow (placeholder).
    // TODO: Panggil endpoint refresh token.
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    refreshSession,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;