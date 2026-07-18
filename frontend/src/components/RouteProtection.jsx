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
    // Redirect logged-in users to their respective dashboard
    if (user.role === 'admin' || user.role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'reseller') {
      return <Navigate to="/reseller" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

// Admin Route - hanya untuk admin
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    // Redirect non-admin users
    if (user.role === 'reseller') {
      return <Navigate to="/reseller" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return children;
};

// Reseller Route - hanya untuk reseller
export const ResellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  if (user.role !== 'reseller') {
    // Redirect non-reseller users
    if (user.role === 'admin' || user.role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return children;
};

// User Route - hanya untuk user biasa
export const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  // If user is admin or reseller, redirect to their dashboard
  if (user.role === 'admin' || user.role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  
  if (user.role === 'reseller') {
    return <Navigate to="/reseller" replace />;
  }

  return children;
};

export default {
  ProtectedRoute,
  GuestRoute,
  AdminRoute,
  ResellerRoute,
  UserRoute
};