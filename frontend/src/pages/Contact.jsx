import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function Contact() {
  return (
    <>
      <nav className="navbar" style={{ position: 'relative' }}>
        <div className="container">
          <Link to="/" className="navbar-logo">
            <img src={assets.logo.main.file} alt={assets.logo.main.alt} width={120} height={36} />
            <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gameku</span>
          </Link>
          <div className="navbar-menu">
            <Link to="/">Beranda</Link>
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-primary btn-sm">Masuk</Link>
          </div>
        </div>
      </nav>
      <div className="section" style={{ paddingTop: 100 }}>
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">Hubungi Kami</h1>
            <p className="section-subtitle">Tim kami siap membantu kamu 24/7</p>
          </div>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              <div className="feature-card" style={{ textAlign: 'center', padding: 24 }}>
                <div className="feature-icon" style={{ margin: '0 auto 12px' }}>📧</div>
                <h3 style={{ fontSize: 'var(--font-sm)', marginBottom: 4 }}>Email</h3>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray)' }}>support@gameku.com</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: 24 }}>
                <div className="feature-icon" style={{ margin: '0 auto 12px' }}>📞</div>
                <h3 style={{ fontSize: 'var(--font-sm)', marginBottom: 4 }}>Telepon</h3>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray)' }}>+62 812-3456-7890</p>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} style={{ background: 'white', padding: 32, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Nama</label>
                <input type="text" placeholder="Nama lengkap" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--gray-3)', borderRadius: 'var(--radius-md)', fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Email</label>
                <input type="email" placeholder="Email aktif" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--gray-3)', borderRadius: 'var(--radius-md)', fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Pesan</label>
                <textarea rows="4" placeholder="Tulis pesan kamu..." style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--gray-3)', borderRadius: 'var(--radius-md)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Kirim Pesan</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;