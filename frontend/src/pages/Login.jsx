import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import assets from '../config/assetConfig';
import '../css/auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();
        if (response.success) {
          navigate('/');
        }
      } catch (error) {
        // User not authenticated, stay on login page
      }
    };
    checkAuth();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      if (response.success) {
        localStorage.setItem('token', response.token);
        navigate('/');
      } else {
        setErrors({ submit: response.message || 'Login gagal' });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Terjadi kesalahan saat login' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    authAPI.googleLogin();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={assets.logo.icon.file} alt={assets.logo.icon.alt} width={32} height={32} style={{ objectFit: 'contain' }} />
            </div>
           <h1>Masuk GameKU</h1>
           <p>Platform Top-Up Game Terpercaya</p>
         </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`auth-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                className={`auth-input ${errors.password ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          <div className="auth-options">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label>Ingat saya</label>
            </label>
            <Link to="/forgot-password" className="auth-forgot">Lupa Password?</Link>
          </div>

          {errors.submit && <span className="auth-error">{errors.submit}</span>}

          <button 
            type="submit" 
            className="auth-btn auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-loading">
                <span className="auth-spinner"></span>
                Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>atau</span>
        </div>

        <button 
          className="auth-btn auth-btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path fill="#4285F4" d="M19.7 9.8c0-1.4-.1-2.3-.4-3.3H9.9v6.2h5.5c-.1 1-1.5 3.1-4.3 4.4l-.1.6 2.8 1.7.8c2.5-2.4 4-5.9 4-9.7z"/>
            <path fill="#34A853" d="M9.9 19.5c3.3 0 6.2-1.1 8.2-2.9l-3.7-2.9c-.9.6-2 1-3.5 1-2.7 0-5.1-1.7-5.9-4.1l-.6.5 2.8 1.7-.6 1.1c-.5 1-.8 2.2-.8 3.4 0 3.6 1.4 6.8 3.8 9.1l4.3-3.6z"/>
            <path fill="#FBBC05" d="M4 12.8c-.4-1-.6-2.5-.6-3.8 0-1.4.2-2.8.6-3.8l-.6-1.1c-1 .5-2 1.3-2.8 2.2L.6 9c.6 1 1.4 2.2 2.4 3.3l.6-.5z"/>
            <path fill="#EA4335" d="M4 6.2c1.4-1.1 3.2-1.8 5.9-1.8 2.2 0 3.6.4 4.5 1l3.2-3.2c-1.8-1.7-4-2.8-7.7-2.8-3.8 0-6.8 1.5-9.2 3.8L4 6.2z"/>
          </svg>
          Masuk dengan Google
        </button>

        <div className="auth-footer">
          <p>Belum punya akun? <Link to="/register">Daftar Sekarang</Link></p>
          <Link to="/" style={{ marginTop: '12px', display: 'inline-block' }}>Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;