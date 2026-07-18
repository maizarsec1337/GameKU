import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import assets from '../config/assetConfig';
import ImageWithFallback from '../components/ImageWithFallback';
import '../css/category.css';

// ====================
// API SERVICE
// ====================

const API_BASE = '/api';

const apiService = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      return null;
    }
  }
};

// ====================
// SIDEBAR MENU
// ====================
const sidebarMenus = [
  { slug: 'topup', name: 'Top Up Game', icon: '🎮' },
  { slug: 'voucher', name: 'Voucher', icon: '🎟️' },
  { slug: 'steam', name: 'Steam', icon: '🪙' },
  { slug: 'giftcard', name: 'Gift Card', icon: '🎁' },
  { slug: 'minecraft', name: 'Minecraft', icon: '🧱' },
  { slug: 'gamekey', name: 'Game Key', icon: '🎯' },
  { slug: 'promo', name: 'Promo', icon: '🔥' },
  { slug: 'account', name: 'Account', icon: '👤' },
  { slug: 'streaming', name: 'Streaming', icon: '📺' },
  { slug: 'utility', name: 'Utility', icon: '🛠️' },
  { slug: 'item', name: 'Item', icon: '🎒' },
  { slug: 'boosting', name: 'Boosting', icon: '🚀' },
  { slug: 'other', name: 'Lainnya', icon: '⋯' }
];

// ====================
// FALLBACK DATA
// ====================
const minecraftServices = [
  { id: 501, name: 'Akun Minecraft', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 502, name: 'Shared Account', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 503, name: 'Premium Account', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 504, name: 'Minecraft Java', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 505, name: 'Minecraft Bedrock', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 506, name: 'Minecoin', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 507, name: 'Jasa Build', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 508, name: 'Pembuatan Map', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 509, name: 'Desain Skin', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 510, name: 'Jasa Plugin', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 511, name: 'Jasa Modpack', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 512, name: 'Jasa Texture Pack', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 513, name: 'Jasa Resource Pack', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 514, name: 'Setup Server', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 515, name: 'Hosting Server', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 516, name: 'Realm', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 517, name: 'VPS Minecraft', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 518, name: 'Plugin Premium', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 519, name: 'Config Server', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 520, name: 'World Download', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 521, name: 'Lobby', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 522, name: 'Spawn', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 523, name: 'Pixel Art', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 524, name: 'Redstone', image: assets.fallback.product.file, slug: 'minecraft' },
  { id: 525, name: 'Command Block', image: assets.fallback.product.file, slug: 'minecraft' }
];

const ALPHABET = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activeSlug = slug || 'topup';

  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const currentMenu = sidebarMenus.find((m) => m.slug === activeSlug) || sidebarMenus[0];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (activeSlug === 'minecraft') {
        // Use fallback data for Minecraft if API not available
        setProducts(minecraftServices);
      } else {
        const data = await apiService.get(`/category/${activeSlug}`);
        if (data && data.products) {
          setProducts(data.products);
        }
      }
    };
    fetchProducts();
  }, [activeSlug]);

  // Filter berdasarkan search + huruf
  const filtered = useMemo(() => {
    return products.filter((g) => {
      const matchSearch = g.name.toLowerCase().includes(search.trim().toLowerCase());
      const firstChar = g.name.charAt(0).toUpperCase();
      const matchLetter = !activeLetter || activeLetter === '#'
        ? !/^[A-Z]$/.test(firstChar)
        : firstChar === activeLetter;
      return matchSearch && matchLetter;
    });
  }, [search, activeLetter, products]);

  // Section konten kanan
  const sections = [
    { title: 'Layanan Populer', icon: '🔥', items: products.slice(0, 8) },
    { title: 'Layanan Baru', icon: '✨', items: products.slice(8, 16) },
    { title: 'Layanan Lain', icon: '🗂️', items: products.slice(16) }
  ];

  const handleGameClick = (id) => {
    navigate(`/product/${id}`);
  };

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
            <img src={assets.logo.icon.file} alt={assets.logo.icon.alt} width={28} height={28} style={{ objectFit: 'contain' }} />
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
            {sidebarMenus.map((m) => (
              <li key={m.slug}>
                <button
                  type="button"
                  className={`category-menu-item ${m.slug === activeSlug ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(m.slug)}
                >
                  <span className="category-menu-icon">{m.icon}</span>
                  <span className="category-menu-name">{m.name}</span>
                </button>
              </li>
            ))}
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
              placeholder="Cari Layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari Layanan"
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
                <div className="category-grid">
                  {filtered.map((g) => (
                    <button key={g.id} type="button" className="game-item" onClick={() => handleGameClick(g.id)}>
                      <ImageWithFallback src={g.image || assets.fallback.product.file} alt={g.name} className="game-item-icon" />
                      <span className="game-item-name">{g.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="category-empty">Tidak ada layanan yang cocok.</p>
              )}
            </section>
          ) : (
            /* Section default */
            sections.map((sec, idx) => sec.items.length > 0 ? (
              <section className="category-section" key={sec.title}>
                <h2 className="category-section-title">
                  <span className="category-section-icon">{sec.icon}</span>
                  {sec.title}
                </h2>
                <div className="category-grid">
                  {sec.items.map((g) => (
                    <button key={g.id} type="button" className="game-item" onClick={() => handleGameClick(g.id)}>
                      <ImageWithFallback src={g.image || assets.fallback.product.file} alt={g.name} className="game-item-icon" />
                      <span className="game-item-name">{g.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null)
          )}
        </main>
      </div>
    </>
  );
}

export default Category;