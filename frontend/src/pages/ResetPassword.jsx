import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import assets from '../config/assetConfig';
import '../css/auth.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
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
      const response = await authAPI.resetPassword({
        token,
        password: formData.password,
      });
      if (response.success) {
        setSuccess(true);
      } else {
        setErrors({ submit: response.message || 'Gagal reset password' });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={assets.logo.icon.file} alt={assets.logo.icon.alt} width={32} height={32} style={{ objectFit: 'contain' }} />
            </div>
            <h1>Password Diperbarui!</h1>
            <p>Password Anda telah berhasil diubah</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" style={{ marginBottom: '20px' }}>
              <path fill="var(--primary)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L18.01 9l-8 8z"/>
            </svg>
            <p style={{ color: 'var(--gray-2)', marginBottom: '20px' }}>
              Silakan masuk dengan password baru Anda
            </p>
            <Link to="/login" className="auth-btn auth-btn-primary">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Token Tidak Valid</h1>
            <p>Tautan reset password tidak valid atau sudah expired</p>
          </div>
          <div className="auth-footer">
            <Link to="/forgot-password" className="auth-btn auth-btn-primary">
              Minta Tautan Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src={assets.logo.icon.file} alt={assets.logo.icon.alt} width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
          <h1>Reset Password</h1>
          <p>Buat password baru untuk akun Anda</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="password">Password Baru</label>
            <div className="auth-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
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
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <div className="auth-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
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
                Memperbarui...
              </span>
            ) : (
              'Simpan Password'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;