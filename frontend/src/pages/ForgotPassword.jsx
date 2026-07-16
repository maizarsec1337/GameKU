import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import assets from '../config/assetConfig';
import '../css/auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email wajib diisi');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email });
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Gagal mengirim email reset password');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan');
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
             <h1>Email Terkirim!</h1>
             <p>Silakan cek email Anda untuk tautan reset password</p>
           </div>

          <div style={{ textAlign: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" style={{ marginBottom: '20px' }}>
              <path fill="var(--primary)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L18.01 9l-8 8z"/>
            </svg>
            <p style={{ color: 'var(--gray-2)', marginBottom: '20px' }}>
              Kami telah mengirimkan tautan reset password ke email Anda. 
              Tautan akan expired dalam 1 jam.
            </p>
            <Link to="/login" className="auth-btn auth-btn-primary">
              Kembali ke Login
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
          <h1>Lupa Password</h1>
          <p>Masukkan email untuk reset password</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className={`auth-input ${error ? 'error' : ''}`}
              disabled={loading}
            />
            {error && <span className="auth-error">{error}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-btn auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-loading">
                <span className="auth-spinner"></span>
                Mengirim...
              </span>
            ) : (
              'Kirim Tautan Reset'
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

export default ForgotPassword;