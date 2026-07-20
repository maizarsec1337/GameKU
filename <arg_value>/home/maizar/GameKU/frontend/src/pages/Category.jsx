import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/apiService';
import '../css/category.css';

const ALPHABET = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activeSlug = slug || 'topup';

  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Fetch categories for sidebar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.get('/category');
        if (data?.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Categories fetch error:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiService.get(`/home/category/${activeSlug}`);
        if (data?.success) {
          setProducts(data.data || []);
          if (data.category) {
            setCurrentCategory(data.category);
          }
        } else {
          setProducts([]);
          setCurrentCategory(null);
        }
      } catch (error) {
        console.error('Products fetch error:', error);
        setProducts([]);
        setCurrentCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setSearch('');
    setActiveLetter('');
  }, [activeSlug]);

  const currentMenu = currentCategory || categories.find((m) => m.slug === activeSlug) || { name: activeSlug };

  // Filter berdasarkan search + huruf
  const filtered = useMemo(() => {
    return products.filter((g) => {
      const matchSearch = g.name?.toLowerCase().includes(search.trim().toLowerCase());
      const firstChar = g.name?.charAt(0).toUpperCase() || '#';
      const matchLetter = !activeLetter || activeLetter === '#'
        ? !/^[A-Z]$/.test(firstChar)
        : firstChar === activeLetter;
      return matchSearch && matchLetter;
    });
  }, [search, activeLetter, products]);

  // Section konten kanan - dynamic based on product categories
  const sections = useMemo(() => {
    // Group products by subcategory if available, otherwise by default grouping
    const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return [
      { 
        title: 'Produk Terbaru', 
        icon: '✨', 
        items: sortedProducts.slice(0, 12) 
      },
      { 
        title: 'Produk Populer', 
        icon: '🔥', 
        items: [...sortedProducts].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 12) 
      },
      { 
        title: 'Lainnya', 
        icon: '🗂️', 
        items: sortedProducts.slice(24) 
      }
    ];
  }, [products]);

  const handleSidebarClick = (s) => {
    setDrawerOpen(false);
    setActiveLetter('');
    setSearch('');
    if (s !== activeSlug) {
      navigate(`/category/${s}`);
    }
  };

  return (
    <>
      {/* NAVBAR */}
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
            <button className="category-drawer-toggle" onClick={() => setDrawerOpen(true)} aria-label="Buka kategori">
              ☰
            </button>
            <Link to="/login" className="btn btn-primary btn-sm">Masuk</Link>
          </div>
        </div>
      </nav>

      {/* DRAWER OVERLAY (mobile) */}
      {drawerOpen && <div className="category-overlay" onClick={() => setDrawerOpen(false)} />}

      <div className="category-layout">
        {/* SIDEBAR */}
        <aside className={`category-sidebar ${drawerOpen ? 'open' : ''}`}>
          <div className="category-sidebar-header">
            <span>Kategori</span>
            <button className="category-sidebar-close" onClick={() => setDrawerOpen(false)} aria-label="Tutup">✕</button>
          </div>
          <ul className="category-menu">
            {categories.length > 0 ? (
              categories.map((m) => (
                <li key={m._id || m.id || m.slug}>
                  <button
                    type="button"
                    className={`category-menu-item ${m.slug === activeSlug ? 'active' : ''}`}
                    onClick={() => handleSidebarClick(m.slug)}
                  >
                    <span className="category-menu-icon">{m.icon || '🎮'}</span>
                    <span className="category-menu-name">{m.name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li>
                <span className="category-menu-item">Memuat kategori...</span>
              </li>
            )}
          </ul>
        </aside>

        {/* KONTEN KANAN */}
        <main className="category-content">
          {/* Breadcrumb */}
          <nav className="category-breadcrumb">
            <Link to="/">Beranda</Link>
            <span className="sep">/</span>
            <span className="current">{currentMenu.name}</span>
          </nav>

          {/* Judul */}
          <h1 className="category-title">{currentMenu.name}</h1>

          {/* Search */}
          <div className="category-search">
            <span className="category-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari Produk"
            />
          </div>

          {/* Filter Huruf */}
          <div className="category-alpha">
            {ALPHABET.map((l) => (
              <button
                key={l}
                type="button"
                className={`alpha-btn ${activeLetter === l ? 'active' : ''}`}
                onClick={() => setActiveLetter(activeLetter === l ? '' : l)}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Hasil pencarian/filter huruf */}
          {search || activeLetter ? (
            <section className="category-section">
              <h2 className="category-section-title">
                <span className="category-section-icon">🔎</span>
                Hasil ({filtered.length})
              </h2>
              {filtered.length > 0 ? (
                <div className="product-grid">
                  {filtered.map((g) => (
                    <ProductCard
                      key={g._id || g.id}
                      id={g._id || g.id}
                      name={g.name}
                      image={g.image}
                      price={g.price}
                      category={g.category}
                      platform={g.platform}
                      originalPrice={g.originalPrice}
                      discount={g.discount}
                      rating={g.rating}
                      sold={g.sold}
                      stock={g.stock}
                      status={g.status}
                      sellerName={g.sellerName}
                      storeName={g.storeName}
                      isOfficial={g.isOfficial}
                    />
                  ))}
                </div>
              ) : (
                <p className="category-empty">Tidak ada produk yang cocok.</p>
              )}
            </section>
          ) : (
            /* Section default */
            sections.map((sec, idx) => sec.items && sec.items.length > 0 ? (
              <section className="category-section" key={sec.title}>
                <h2 className="category-section-title">
                  <span className="category-section-icon">{sec.icon}</span>
                  {sec.title}
                </h2>
                <div className="product-grid">
                  {sec.items.map((g) => (
                    <ProductCard
                      key={g._id || g.id}
                      id={g._id || g.id}
                      name={g.name}
                      image={g.image}
                      price={g.price}
                      category={g.category}
                      platform={g.platform}
                      originalPrice={g.originalPrice}
                      discount={g.discount}
                      rating={g.rating}
                      sold={g.sold}
                      stock={g.stock}
                      status={g.status}
                      sellerName={g.sellerName}
                      storeName={g.storeName}
                      isOfficial={g.isOfficial}
                    />
                  ))}
                </div>
              </section>
            ) : null)
          )}

          {!loading && products.length === 0 && !search && !activeLetter && (
            <p className="category-empty">Belum ada produk dalam kategori ini.</p>
          )}
        </main>
      </div>
    </>
  );
}

export default Category;