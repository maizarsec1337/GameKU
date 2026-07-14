import React from 'react';
import { Link, useParams } from 'react-router-dom';

function Product() {
  const { id } = useParams();

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
        <h1>Detail Produk</h1>
        <p>Halaman detail produk dengan ID: {id || '-'}</p>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>Halaman ini akan menampilkan detail produk, harga, dan opsi pembelian.</p>
        <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    </>
  );
}

export default Product;