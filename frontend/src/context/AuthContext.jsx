/**
 * Auth Context
 * Context untuk manajemen state autentikasi di frontend
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/authAPI';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../config/firebase';

// Initialize Firebase
let firebaseApp;
let firebaseAuth;

try {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
} catch (e) {
  // Firebase already initialized
  firebaseAuth = getAuth();
}

// Create auth context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Sync Firebase auth state with context
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      // If Firebase user exists but no JWT token, get Firebase ID token and sync with backend
      if (firebaseUser) {
        const token = localStorage.getItem('token');
        if (token) {
          // JWT exists, verify with backend
          try {
            const response = await authAPI.me();
            const data = response.data || response;
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              // Token invalid, clear it
              localStorage.removeItem('token');
              setUser(null);
            }
          } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          // No JWT but Firebase user exists - means user logged in via Firebase elsewhere
          // Get the ID token and sync with backend
          try {
            const idToken = await firebaseUser.getIdToken();
            if (idToken) {
              const response = await authAPI.googleLogin(idToken);
              const data = response.data || response;
              if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
              }
            }
          } catch (error) {
            console.warn('Failed to sync Firebase user with backend:', error);
          }
        }
      } else {
        // No Firebase user - check if we have a JWT token
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          try {
            const response = await authAPI.me();
            const data = response.data || response;
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              localStorage.removeItem('token');
              setUser(null);
            }
          } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Cek status autentikasi
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.me();
        // Handle axios response format (response.data) or direct response
        const data = response.data || response;
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
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
      const data = response.data || response; // Handle axios response
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

  // Google Login - Firebase based
  const googleLogin = async (idToken) => {
    setLoading(true);
    setError(null);
    try {
      if (!idToken) {
        throw new Error('ID token diperlukan');
      }
      const response = await authAPI.googleLogin(idToken);
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
      const message = error.response?.data?.message || error.message || 'Terjadi kesalahan saat login Google';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with frontend logout even if backend fails
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      sessionStorage.removeItem('loginSuccess');
      // Sign out from Firebase too
      if (firebaseAuth) {
        try {
          await firebaseAuth.signOut();
        } catch (e) {
          // Firebase signout failed, continue
        }
      }
      setLoading(false);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    // Try to refresh by calling /me endpoint
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
    firebaseUser,
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