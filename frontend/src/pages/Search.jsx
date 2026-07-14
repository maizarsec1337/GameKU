import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

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
        <h1>Pencarian</h1>
        <div style={{ width: '100%', maxWidth: 500, marginBottom: 'var(--space-lg)' }}>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--gray-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-base)' }}
            />
            <button type="submit" className="btn btn-primary">Cari</button>
          </form>
        </div>
        {query && <p>Hasil pencarian untuk: <strong>"{query}"</strong></p>}
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>Halaman ini akan menampilkan hasil pencarian produk.</p>
        <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    </>
  );
}

export default Search;