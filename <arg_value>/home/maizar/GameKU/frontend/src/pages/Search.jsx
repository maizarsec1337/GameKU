import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import apiService from '../services/apiService';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch search results when query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await apiService.get(`/search?q=${encodeURIComponent(query)}`);
        if (data?.success) {
          setSearchResults(data.data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Fetch popular searches
  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const data = await apiService.get('/search/popular');
        if (data?.success) {
          setPopularSearches(data.data || []);
        }
      } catch (error) {
        console.error('Popular searches error:', error);
      }
    };

    fetchPopularSearches();
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await apiService.get(`/search/suggestions?q=${encodeURIComponent(searchInput)}`);
        if (data?.success) {
          setSuggestions(data.data || []);
        }
      } catch (error) {
        console.error('Suggestions error:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const renderSuggestions = useMemo(() => {
    if (suggestions.length === 0 || searchInput.length < 2) return null;
    
    return (
      <div className="search-suggestions">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className="search-suggestion-item"
            onClick={() => {
              setSearchInput(suggestion.name);
              setSearchParams({ q: suggestion.name });
              setSuggestions([]);
            }}
          >
            {suggestion.name}
          </button>
        ))}
      </div>
    );
  }, [suggestions, searchInput, setSearchParams]);

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
            <div style={{ width: '100%', maxWidth: 500, marginTop: 'var(--space-lg)', position: 'relative' }}>
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
              {renderSuggestions}
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
              Mencari...
            </div>
          )}

          {query && !loading && (
            <>
              <p style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                Hasil pencarian untuk: <strong>"{query}"</strong>
              </p>
              
              {searchResults.length > 0 ? (
                <div className="product-grid" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  {searchResults.map((item) => (
                    <ProductCard
                      key={item._id || item.id}
                      id={item._id || item.id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      category={item.category}
                      platform={item.platform}
                      originalPrice={item.originalPrice}
                      discount={item.discount}
                      rating={item.rating}
                      sold={item.sold}
                      stock={item.stock}
                      status={item.status}
                      sellerName={item.sellerName}
                      storeName={item.storeName}
                      isOfficial={item.isOfficial}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>
                  Tidak ada produk yang ditemukan.
                </p>
              )}
            </>
          )}

          {!query && !loading && (
            <>
              <p style={{ textAlign: 'center', fontSize: 'var(--font-sm)', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>
                Masukkan kata kunci untuk mencari produk.
              </p>
              
              {popularSearches.length > 0 && (
                <div style={{ marginTop: 'var(--space-xl)' }}>
                  <h3 style={{ fontSize: 'var(--font-lg)', marginBottom: 'var(--space-md)' }}>Pencarian Populer</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {popularSearches.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setSearchInput(item);
                          setSearchParams({ q: item });
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;