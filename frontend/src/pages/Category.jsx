import React from 'react';
import { Link, useParams } from 'react-router-dom';

function Category() {
  const { slug } = useParams();
  const categoryNames = {
    topup: 'Top Up Game',
    voucher: 'Voucher Game',
    steam: 'Steam Wallet',
    giftcard: 'Gift Card',
    membership: 'Membership',
    googleplay: 'Google Play',
    playstation: 'PlayStation',
    entertainment: 'Entertainment'
  };

  return (
    <>
      <nav className="navbar" style={{ position: 'relative' }}>
        <div className="container">
          <Link to="/" className="navbar-logo">
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
      <div className="page-placeholder">
        <h1>{categoryNames[slug] || 'Kategori'}</h1>
        <p>Halaman kategori {slug}</p>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>Halaman ini akan menampilkan daftar produk berdasarkan kategori.</p>
        <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    </>
  );
}

export default Category;