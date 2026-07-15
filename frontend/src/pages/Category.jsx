import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import assets from '../config/assetConfig';
import ImageWithFallback from '../components/ImageWithFallback';
import '../css/category.css';

// ====================
// SIDEBAR MENU
// ====================
const sidebarMenus = [
  { slug: 'topup', name: 'Top Up Game', icon: '🎮' },
  { slug: 'gamekey', name: 'Game Key', icon: '🎯' },
  { slug: 'voucher', name: 'Voucher', icon: '🎟️' },
  { slug: 'steam', name: 'Steam', icon: '🪙' },
  { slug: 'giftcard', name: 'Gift Card', icon: '🎁' },
  { slug: 'membership', name: 'Membership', icon: '⭐' },
  { slug: 'promo', name: 'Promo', icon: '🔥' },
  { slug: 'account', name: 'Account', icon: '👤' },
  { slug: 'streaming', name: 'Streaming', icon: '📺' },
  { slug: 'utility', name: 'Utility', icon: '🛠️' },
  { slug: 'item', name: 'Item', icon: '🎒' },
  { slug: 'boosting', name: 'Boosting', icon: '🚀' },
  { slug: 'other', name: 'Lainnya', icon: '⋯' }
];

// ====================
// DATA GAME (icon dari asset project)
// ====================
const gameList = [
  { id: 1, name: 'Mobile Legends', image: assets.game.mlbb.file, slug: 'topup' },
  { id: 2, name: 'Free Fire', image: assets.game.ff.file, slug: 'topup' },
  { id: 3, name: 'PUBG Mobile', image: assets.game.pubg.file, slug: 'topup' },
  { id: 4, name: 'Genshin Impact', image: assets.game.genshin.file, slug: 'topup' },
  { id: 5, name: 'Valorant', image: assets.game.valorant.file, slug: 'topup' },
  { id: 6, name: 'FIFA Mobile', image: assets.game.fifa.file, slug: 'topup' },
  { id: 7, name: 'Call of Duty Mobile', image: assets.game.cod.file, slug: 'topup' },
  { id: 8, name: 'League of Legends', image: assets.game.lol.file, slug: 'topup' },
  { id: 9, name: 'Steam Wallet', image: assets.steam.wallet.file, slug: 'steam' },
  { id: 10, name: 'PlayStation Plus', image: assets.game.playstation.file, slug: 'voucher' },
  { id: 11, name: 'Xbox Live', image: assets.game.xbox.file, slug: 'voucher' },
  { id: 12, name: 'Google Play', image: assets.voucher.googleplay.file, slug: 'voucher' },
  { id: 13, name: 'PlayStation', image: assets.voucher.playstation.file, slug: 'voucher' },
  { id: 14, name: 'Xbox', image: assets.voucher.xbox.file, slug: 'voucher' },
  { id: 15, name: 'Nintendo', image: assets.voucher.nintendo.file, slug: 'voucher' },
  { id: 16, name: 'Steam Gift Card', image: assets.steam.giftcard.file, slug: 'giftcard' },
  { id: 17, name: 'Apple iTunes', image: assets.giftcard.itunes.file, slug: 'giftcard' },
  { id: 18, name: 'Spotify Premium', image: assets.giftcard.spotify.file, slug: 'giftcard' },
  { id: 19, name: 'Netflix', image: assets.giftcard.netflix.file, slug: 'giftcard' },
  { id: 20, name: 'YouTube Premium', image: assets.giftcard.youtube.file, slug: 'giftcard' },
  { id: 21, name: 'VIP Membership', image: assets.membership.vip.file, slug: 'membership' },
  { id: 22, name: 'Premium Membership', image: assets.membership.premium.file, slug: 'membership' }
];

const ALPHABET = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activeSlug = slug || 'topup';

  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentMenu = sidebarMenus.find((m) => m.slug === activeSlug) || sidebarMenus[0];

  // Filter berdasarkan search + huruf
  const filtered = useMemo(() => {
    return gameList.filter((g) => {
      const matchSearch = g.name.toLowerCase().includes(search.trim().toLowerCase());
      const firstChar = g.name.charAt(0).toUpperCase();
      const matchLetter = !activeLetter || activeLetter === '#'
        ? !/^[A-Z]$/.test(firstChar)
        : firstChar === activeLetter;
      return matchSearch && matchLetter;
    });
  }, [search, activeLetter]);

  // Section konten kanan
  const sections = [
    { title: 'Kategori Populer', icon: '🔥', items: gameList.slice(0, 8) },
    { title: 'Kategori Baru', icon: '✨', items: gameList.slice(8, 16) },
    { title: 'Kategori Lain', icon: '🗂️', items: gameList.slice(16) }
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
            <img src={assets.logo.main.file} alt={assets.logo.main.alt} width={120} height={36} />
            <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gameku</span>
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
              placeholder="Cari Game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari Game"
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
                      <ImageWithFallback src={g.image} alt={g.name} className="game-item-icon" />
                      <span className="game-item-name">{g.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="category-empty">Tidak ada game yang cocok.</p>
              )}
            </section>
          ) : (
            /* Section default */
            sections.map((sec) => (
              <section className="category-section" key={sec.title}>
                <h2 className="category-section-title">
                  <span className="category-section-icon">{sec.icon}</span>
                  {sec.title}
                </h2>
                <div className="category-grid">
                  {sec.items.map((g) => (
                    <button key={g.id} type="button" className="game-item" onClick={() => handleGameClick(g.id)}>
                      <ImageWithFallback src={g.image} alt={g.name} className="game-item-icon" />
                      <span className="game-item-name">{g.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </>
  );
}

export default Category;