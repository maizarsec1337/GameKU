import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function NotFound() {
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
      <div className="page-placeholder" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <h1 style={{ fontSize: 80, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>404</h1>
        <h2 style={{ fontSize: 'var(--font-2xl)', color: 'var(--white)', marginBottom: 12 }}>Halaman Tidak Ditemukan</h2>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--gray-2)', marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
          Halaman yang kamu cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Kembali ke Beranda</Link>
      </div>
    </>
  );
}

export default NotFound;