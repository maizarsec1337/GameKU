import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import assets from '../config/assetConfig';
import ProductCard from '../components/ProductCard';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const searchResults = [
    { id: 1, name: 'Mobile Legends', image: assets.game.mlbb.file, price: 'Rp15.000', category: 'Top Up' },
    { id: 2, name: 'Free Fire', image: assets.game.ff.file, price: 'Rp10.000', category: 'Top Up' },
    { id: 3, name: 'PUBG Mobile', image: assets.game.pubg.file, price: 'Rp20.000', category: 'Top Up' },
    { id: 4, name: 'Google Play', image: assets.voucher.googleplay.file, price: 'Rp20.000 - Rp500.000', category: 'Voucher' },
  ];

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
            <h1 className="section-title">Pencarian</h1>
            <div style={{ width: '100%', maxWidth: 500, marginTop: 'var(--space-lg)' }}>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--gray-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-base)', background: 'var(--dark-2)', color: 'var(--white)' }}
                />
                <button type="submit" className="btn btn-primary">Cari</button>
              </form>
            </div>
          </div>
          {query && (
            <>
              <p style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>Hasil pencarian untuk: <strong>"{query}"</strong></p>
              <div className="product-carousel" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                {searchResults.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    category={item.category}
                  />
                ))}
              </div>
            </>
          )}
          {!query && (
            <p style={{ textAlign: 'center', fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>Masukkan kata kunci untuk mencari produk.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;