/**
 * Route Protection Components
 * Komponen untuk melindungi route berdasarkan autentikasi dan role
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route - hanya untuk user yang sudah login
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TODO:
  // Route Protection.

  // TODO:
  // Loading state while checking auth.

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Guest Route - hanya untuk user yang belum login (login, register)
export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // TODO:
  // Route Protection.

  // TODO:
  // Loading state while checking auth.

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Route - hanya untuk admin
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TODO:
  // Middleware Role.

  // TODO:
  // Middleware Admin.

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Implementasi pengecekan role admin
  // if (user.role !== 'admin' && user.role !== 'super_admin') {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

// Reseller Route - hanya untuk reseller
export const ResellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TODO:
  // Middleware Role.

  // TODO:
  // Middleware Seller.

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Implementasi pengecekan role reseller
  // if (user.role !== 'reseller') {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

// User Route - hanya untuk user biasa
export const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TODO:
  // Middleware Role.

  // TODO:
  // Middleware User.

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Implementasi pengecekan role user
  // if (user.role !== 'user') {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default {
  ProtectedRoute,
  GuestRoute,
  AdminRoute,
  ResellerRoute,
  UserRoute
};