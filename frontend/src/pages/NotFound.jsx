import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-placeholder" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <h1 style={{ fontSize: 80, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>404</h1>
      <h2 style={{ fontSize: 'var(--font-2xl)', color: 'var(--dark)', marginBottom: 12 }}>Halaman Tidak Ditemukan</h2>
      <p style={{ fontSize: 'var(--font-base)', color: 'var(--gray)', marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
        Halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">Kembali ke Beranda</Link>
    </div>
  );
}

export default NotFound;