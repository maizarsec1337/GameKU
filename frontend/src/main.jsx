import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './css/theme.css';
import './css/app.css';
import './css/home.css';
import './css/responsive.css';
import './css/auth.css';
import './css/admin.css';

// Preload critical assets
const preloadAssets = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/gambar/logo/icon.png';
  document.head.appendChild(link);
};

preloadAssets();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);