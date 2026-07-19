import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import { useAuth } from '../context/AuthContext';
import assets from '../config/assetConfig';
import '../css/auth.css';

function Register() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Nama minimal 3 karakter';
    }

    if (!formData.username) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username minimal 4 karakter';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username hanya boleh huruf, angka, dan underscore';
    }

    if (!formData.phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^08[0-9]{8,12}$/.test(formData.phone)) {
      newErrors.phone = 'Nomor telepon harus dimulai dengan 08 dan 10-15 digit';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const data = {
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: 'user', // Default role
      };

      const response = await authAPI.register(data);
      const respData = response.data || response;
      if (respData.success && respData.token) {
        localStorage.setItem('token', respData.token);
        await checkAuth();
        navigate('/user', { replace: true });
      } else {
        setErrors({ submit: respData.message || 'Registrasi gagal' });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Terjadi kesalahan saat registrasi' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = '/api/auth/google';
    } catch (error) {
      setErrors({ submit: 'Registrasi Google gagal. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone, only allow numbers
    if (name === 'phone' && value && !/^08[0-9]*$/.test(value)) {
      return;
    }
    
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
          <h1>Daftar GameKU</h1>
          <p>Buat akun untuk mulai berbelanja</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="fullName">Nama Lengkap</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className={`auth-input ${errors.fullName ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.fullName && <span className="auth-error">{errors.fullName}</span>}
          </div>

          <div className="auth-input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              className={`auth-input ${errors.username ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.username && <span className="auth-error">{errors.username}</span>}
          </div>

          <div className="auth-input-group">
            <label htmlFor="phone">Nomor Telepon</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              className={`auth-input ${errors.phone ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.phone && <span className="auth-error">{errors.phone}</span>}
          </div>

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
                placeholder="Minimal 6 karakter"
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

          <div className="auth-input-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <div className="auth-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
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
                Mendaftar...
              </span>
            ) : (
              'Daftar'
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
          Daftar dengan Google
        </button>

        <div className="auth-footer">
          <p>Sudah punya akun? <Link to="/login">Masuk Sekarang</Link></p>
          <Link to="/" style={{ marginTop: '12px', display: 'inline-block' }}>Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;