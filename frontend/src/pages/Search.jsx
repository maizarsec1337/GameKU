import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import apiService from '../services/apiService';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch search results dynamically
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await apiService.get(`/search?q=${encodeURIComponent(query)}`);
        if (data?.success) {
          setResults(data.data || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <>
      <nav className="navbar" style={{ position: 'relative' }}>
        <div className="container">
          <Link to="/" className="navbar-logo">
            <img src="/gambar/logo/Glogo.png" alt="Gameku Icon" width={28} height={28} style={{ objectFit: 'contain' }} />
            <span>Gameku</span>
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
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
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
              <p style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                Hasil pencarian untuk: <strong>"{query}"</strong>
              </p>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>Mencari...</div>
              ) : results.length > 0 ? (
                <div className="product-carousel" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  {results.map((item) => (
                    <ProductCard
                      key={item._id || item.id}
                      id={item._id || item.id}
                      name={item.name}
                      image={item.image || item.image}
                      price={item.price || 'Rp0'}
                      category={item.category}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Tidak ada hasil ditemukan.</p>
              )}
            </>
          )}
          {!query && (
            <p style={{ textAlign: 'center', fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>
              Masukkan kata kunci untuk mencari produk.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;