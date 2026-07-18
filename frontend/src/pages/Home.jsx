import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import assets from '../config/assetConfig';
import ProductCard from '../components/ProductCard';
import ImageWithFallback from '../components/ImageWithFallback';

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

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topupGames, setTopupGames] = useState([]);
  const [steamKeys, setSteamKeys] = useState([]);
  const [minecraftProducts, setMinecraftProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const carouselRefs = {
    topup: React.useRef(null),
    steam: React.useRef(null),
    minecraft: React.useRef(null),
    voucher: React.useRef(null),
    giftcard: React.useRef(null),
    promo: React.useRef(null),
    banner: React.useRef(null)
  };

  // State untuk mode "Lihat Semua" (carousel <-> grid) per section
  const [expandedSections, setExpandedSections] = useState({});
  const [closingSections, setClosingSections] = useState({});

  // Fetch data dari Backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          bannersData,
          categoriesData,
          topupData,
          steamData,
          minecraftData,
          voucherData,
          giftcardData,
          promoData
        ] = await Promise.all([
          apiService.get('/banner'),
          apiService.get('/category'),
          apiService.get('/game?category=topup'),
          apiService.get('/game?category=steam'),
          apiService.get('/category/minecraft'),
          apiService.get('/voucher'),
          apiService.get('/category/giftcard'),
          apiService.get('/promo')
        ]);

        if (bannersData && bannersData.success && Array.isArray(bannersData.data)) {
          setBanners(bannersData.data);
        }

        if (categoriesData && categoriesData.success && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data);
        }

        if (topupData && topupData.success && Array.isArray(topupData.data)) {
          setTopupGames(topupData.data);
        }

        if (steamData && steamData.success && Array.isArray(steamData.data)) {
          setSteamKeys(steamData.data);
        }

        if (minecraftData && minecraftData.success && Array.isArray(minecraftData.products)) {
          setMinecraftProducts(minecraftData.products);
        }

        if (voucherData && voucherData.success && Array.isArray(voucherData.data)) {
          setVouchers(voucherData.data);
        }

        if (giftcardData && giftcardData.success && Array.isArray(giftcardData.products)) {
          setGiftCards(giftcardData.products);
        } else if (giftcardData && giftcardData.success && Array.isArray(giftcardData.data)) {
          setGiftCards(giftcardData.data);
        }

        if (promoData && promoData.success && Array.isArray(promoData.data)) {
          setPromos(promoData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (key) => {
    if (expandedSections[key]) {
      // Menutup: animasi halus lalu kembalikan ke carousel
      setClosingSections((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setClosingSections((prev) => ({ ...prev, [key]: false }));
        setExpandedSections((prev) => ({ ...prev, [key]: false }));
      }, 320);
    } else {
      // Membuka: langsung tampilkan semua card dalam grid
      setExpandedSections((prev) => ({ ...prev, [key]: true }));
    }
  };

  // ====================
  // HANDLERS
  // ====================

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollCarousel = (refName, direction) => {
    const ref = carouselRefs[refName];
    if (ref && ref.current) {
      if (refName === 'banner') {
        const slide = ref.current.querySelector('.banner-slide');
        if (slide) {
          const slideWidth = slide.offsetWidth;
          const gap = 8;
          ref.current.scrollBy({ left: direction * (slideWidth + gap), behavior: 'smooth' });
        }
      } else {
        const card = ref.current.querySelector('.product-card');
        if (card) {
          const cardWidth = card.offsetWidth;
          const gap = 8;
          ref.current.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
        }
      }
    }
  };

  // ====================
  // NAVBAR
  // ====================

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderNavbar = () => (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          <img src={assets.logo.icon.file} alt={assets.logo.icon.alt} width={28} height={28} style={{ objectFit: 'contain' }} />
          <span>Gameku</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="active" onClick={closeMenu}>Beranda</Link>
          <Link to="/category/topup" onClick={closeMenu}>Top Up</Link>
          <Link to="/category/voucher" onClick={closeMenu}>Voucher</Link>
          <Link to="/category/steam" onClick={closeMenu}>Steam</Link>
          <Link to="/category/minecraft" onClick={closeMenu}>Minecraft</Link>
          <Link to="/promo" onClick={closeMenu}>Promo</Link>
          <Link to="/about" onClick={closeMenu}>Tentang</Link>
        </div>

        <div className="navbar-actions">
          <button className="btn-icon" aria-label="Search" onClick={() => navigate('/search')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button className="btn-icon" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" x2="21" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-count">0</span>
          </button>

          {user ? (
            <div className="user-menu">
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'reseller' ? '/reseller' : '/user'} className="btn btn-primary btn-sm">
                <span>👤</span>
                <span className="user-name">{user.fullName || user.email}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ marginLeft: '8px' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Masuk</span>
            </Link>
          )}

          <button
            className={`navbar-hamburger ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );

  // ====================
  // BANNER AUTO SLIDE
  // ====================

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // ====================
  // BANNER CAROUSEL
  // ====================

  const renderBanner = () => (
    <section className="banner-section">
      <div className="container">
        <div className="banner-carousel" ref={carouselRefs.banner}>
          {banners.length > 0 ? (
            <>
              <div className="banner-slider" style={{
                display: 'flex',
                transform: `translateX(-${currentBannerIndex * 100}%)`,
                transition: 'transform 0.5s ease-in-out',
                width: '100%'
              }}>
                {banners.map((banner, index) => (
                  <div className="banner-slide" key={banner._id || banner.id || index}>
                    <ImageWithFallback src={banner.image} alt={banner.alt || banner.title || 'Banner'} />
                  </div>
                ))}
              </div>
              <div className="banner-indicators">
                {banners.map((_, index) => (
                  <div
                    key={index}
                    className={`banner-indicator ${index === currentBannerIndex ? 'active' : ''}`}
                    onClick={() => setCurrentBannerIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="loading-state" style={{ height: '180px' }}>Memuat banner...</div>
          )}
        </div>
      </div>
    </section>
  );

  // ====================
  // CATEGORY ICONS
  // ====================

  const renderCategories = () => (
    <section className="section-categories">
      <div className="container">
        <div className="categories-row">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <Link to={`/category/${cat.slug}`} className="category-item" key={cat._id || cat.id || index}>
                <div className="category-icon-wrapper">
                  <span className="category-emoji">{cat.icon || '🎮'}</span>
                </div>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))
          ) : (
            <div className="loading-state">Memuat kategori...</div>
          )}
        </div>
      </div>
    </section>
  );

  // ====================
  // CAROUSEL SECTION
  // ====================

  const renderCarouselSection = (title, subtitle, data, gridClassName, viewAllLink, sectionKey) => {
    const isExpanded = !!expandedSections[gridClassName];
    const isClosing = !!closingSections[gridClassName];

    return (
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-flex">
              <div className="section-title-wrapper">
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
              </div>
              <button
                type="button"
                className={`btn-view-all ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => toggleSection(gridClassName)}
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua'}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" />
                  <polyline points={isExpanded ? '12 19 5 12 12 5' : '12 5 19 12 12 19'} />
                </svg>
              </button>
            </div>
          </div>

          {isExpanded || isClosing ? (
            <div className={`product-grid ${gridClassName} ${isClosing ? 'grid-closing' : 'grid-opening'}`} key={gridClassName}>
              {data.length > 0 ? (
                data.map((item) => (
                 <ProductCard
                      key={item.id || item._id}
                      id={item.id || item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price || 'Rp0'}
                      category={item.category}
                      platform={item.category}
                      originalPrice={item.originalPrice}
                      discount={item.discount}
                    />
                ))
              ) : (
                <div className="empty-state">Tidak ada produk tersedia</div>
              )}
            </div>
          ) : (
            <div className="carousel-wrapper">
              <button className="carousel-btn carousel-prev" onClick={() => scrollCarousel(gridClassName, -1)}>
                ‹
              </button>
              <div className={`product-carousel ${gridClassName}`} ref={carouselRefs[gridClassName]}>
                {data.length > 0 ? (
                  data.map((item) => (
                    <ProductCard
                      key={item.id || item._id}
                      id={item.id || item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price || 'Rp0'}
                      category={item.category}
                      platform={item.category}
                      originalPrice={item.originalPrice}
                      discount={item.discount}
                    />
                  ))
                ) : (
                  <div className="loading-state">Memuat produk...</div>
                )}
              </div>
              <button className="carousel-btn carousel-next" onClick={() => scrollCarousel(gridClassName, 1)}>
                ›
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  // ====================
  // TOP UP GAMES SECTION (Official Product)
  // ====================

  const renderTopUpGames = () => {
    const topupData = topupGames.length > 0 ? topupGames : [];

    return renderCarouselSection(
      'Top Up Games',
      'Produk Official GameKU - Mobile Legends, Free Fire, PUBG, Valorant, Roblox, Growtopia',
      topupData,
      'topup',
      '/category/topup'
    );
  };

  // ====================
  // RANDOM STEAM KEY SECTION (Marketplace Product)
  // ====================

  const renderSteamKeys = () => {
    const steamData = steamKeys.length > 0 ? steamKeys : [];

    return renderCarouselSection(
      'Random Steam Key',
      'Produk dari Marketplace Seller - Steam Wallet & Game Key',
      steamData,
      'steam',
      '/category/steam'
    );
  };

  // ====================
  // MINECRAFT MARKETPLACE SECTION
  // ====================

  const renderMinecraft = () => {
    const minecraftData = minecraftProducts.length > 0 ? minecraftProducts : [];

    return renderCarouselSection(
      'Minecraft Marketplace',
      'Akun, Shared Account, Minecoin, Server, Jasa Build, Plugin, Resource Pack',
      minecraftData,
      'minecraft',
      '/category/minecraft'
    );
  };

  // ====================
  // VOUCHER SECTION
  // ====================

  const renderVoucherSection = () => {
    const voucherData = vouchers.length > 0 ? vouchers : [];

    return renderCarouselSection(
      'Voucher Game',
      'Voucher untuk berbagai platform game',
      voucherData,
      'voucher',
      '/category/voucher'
    );
  };

  // ====================
  // GIFT CARD SECTION
  // ====================

  const renderGiftCardSection = () => {
    const giftcardData = giftCards.length > 0 ? giftCards : [];

    return renderCarouselSection(
      'Gift Card',
      'Gift card untuk hiburan digital',
      giftcardData,
      'giftcard',
      '/category/giftcard'
    );
  };

  // ====================
  // PROMO SECTION
  // ====================

  const renderPromoSection = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-header-flex">
            <div className="section-title-wrapper">
              <h2 className="section-title">Promo Spesial</h2>
              <p className="section-subtitle">Nikmati berbagai promo menarik dari GameKU</p>
            </div>
            <Link to="/promo" className="btn-view-all">
              <span>Lihat Semua</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => scrollCarousel('promo', -1)}>
            ‹
          </button>
          <div className="product-carousel promo" ref={carouselRefs.promo}>
            {promos.length > 0 ? (
              promos.map((item) => (
                <ProductCard
                  key={item.id || item._id}
                  id={item.id || item._id}
                  name={item.title || item.name}
                  image={item.image}
                  price={item.price || 'Rp0'}
                  category={item.category}
                  platform={item.category}
                  originalPrice={item.originalPrice}
                  discount={item.discount}
                />
              ))
            ) : (
              <div className="loading-state">Memuat promo...</div>
            )}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => scrollCarousel('promo', 1)}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // LOADING STATE
  // ====================

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Memuat...</div>
      </div>
    );
  }

  // ====================
  // FOOTER
  // ====================

  const renderFooter = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Gameku</h3>
            <p>
              Gameku adalah platform digital gaming store terpercaya di Indonesia. 
              Kami menyediakan Top Up Game, Voucher Game, Steam Wallet, Gift Card, 
              Minecraft, dan berbagai kebutuhan digital lainnya dengan harga terbaik.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="YouTube">YT</a>
              <a href="#" aria-label="TikTok">TK</a>
            </div>
          </div>

          <div>
            <h4>Produk</h4>
            <ul>
              <li><Link to="/category/topup">Top Up Game</Link></li>
              <li><Link to="/category/voucher">Voucher Game</Link></li>
              <li><Link to="/category/steam">Steam Wallet</Link></li>
              <li><Link to="/category/giftcard">Gift Card</Link></li>
              <li><Link to="/category/minecraft">Minecraft</Link></li>
            </ul>
          </div>

          <div>
            <h4>Perusahaan</h4>
            <ul>
              <li><Link to="/about">Tentang Kami</Link></li>
              <li><Link to="/contact">Hubungi Kami</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Kebijakan Privasi</Link></li>
              <li><Link to="/terms">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          <div>
            <h4>Kontak</h4>
              <ul>
                <li><a href="mailto:support@gameku.store">support@gameku.store</a></li>
              </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gameku. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Kebijakan Privasi</Link>
            <Link to="/terms">Syarat & Ketentuan</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );

  // ====================
  // RENDER
  // ====================

  return (
    <>
      {renderNavbar()}
      {renderBanner()}
      {renderCategories()}
      {renderTopUpGames()}
      {renderSteamKeys()}
      {renderMinecraft()}
      {renderVoucherSection()}
      {renderGiftCardSection()}
      {renderPromoSection()}
      {renderFooter()}
    </>
  );
}

export default Home;