/**
 * Auth Context
 * Context untuk manajemen state autentikasi di frontend
 * 
 * Menggunakan autentikasi berbasis backend JWT - bukan Firebase Client SDK
 * - Semua status login diperoleh dari /api/auth/me
 * - Token disimpan di localStorage
 * - Cookie httpOnly dihandle oleh backend
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/authAPI';

// Create auth context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Cek status autentikasi
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authAPI.me();
      const data = response.data || response;
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      const data = response.data || response;
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
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
      const data = response.data || response;
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Google Login - redirect to backend OAuth
  const googleLogin = async () => {
    setError(null);
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = '/api/auth/google';
      return { success: true };
    } catch (error) {
      const message = error.message || 'Terjadi kesalahan saat login Google';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = async (navigateCallback) => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with frontend logout even if backend fails
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      sessionStorage.removeItem('loginSuccess');
      setLoading(false);
      if (navigateCallback) {
        navigateCallback('/login');
      }
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const response = await authAPI.me();
      const data = response.data || response;
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      // Silent fail
    }
    return { success: false };
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