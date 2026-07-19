import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import assets from '../config/assetConfig';
import ProductCard from '../components/ProductCard';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/apiService';
import { dataCache, CACHE_KEYS } from '../services/dataCache';
import { SkeletonBanner, SkeletonCategory, SkeletonProductCard, SkeletonPromo } from '../components/SkeletonLoader';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Data states
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topupGames, setTopupGames] = useState([]);
  const [steamKeys, setSteamKeys] = useState([]);
  const [minecraftProducts, setMinecraftProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [promos, setPromos] = useState([]);
  
  // Individual loading states for progressive rendering
  const [bannersLoading, setBannersLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [topupLoading, setTopupLoading] = useState(true);
  const [steamLoading, setSteamLoading] = useState(true);
  const [minecraftLoading, setMinecraftLoading] = useState(true);
  const [voucherLoading, setVoucherLoading] = useState(true);
  const [giftcardLoading, setGiftcardLoading] = useState(true);
  const [promoLoading, setPromoLoading] = useState(true);
  
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

  // Prefetch cache - store for immediate navigation
  useEffect(() => {
    // Prefetch data untuk halaman lain saat idle
    const prefetchData = async () => {
      const cache = dataCache;
      
      // Prefetch topup, voucher, steam, minecraft data
      const prefetchPromises = [
        apiService.get('/game?category=topup', false),
        apiService.get('/category/voucher', false),
        apiService.get('/game?category=steam', false),
        apiService.get('/category/minecraft', false)
      ];
      
      await Promise.allSettled(prefetchPromises);
    };
    
    // Delay prefetch sampai browser idle
    const idleCallback = setTimeout(prefetchData, 2000);
    return () => clearTimeout(idleCallback);
  }, []);

  // Fetch data dengan parallel loading + cache
  useEffect(() => {
    // Check if data sudah ada di cache
    const cachedBanners = dataCache.get(CACHE_KEYS.BANNERS);
    const cachedCategories = dataCache.get(CACHE_KEYS.CATEGORIES);
    const cachedTopup = dataCache.get(CACHE_KEYS.TOPUP_PRODUCTS);
    const cachedSteam = dataCache.get(CACHE_KEYS.STEAM_PRODUCTS);
    const cachedMinecraft = dataCache.get(CACHE_KEYS.MINECRAFT_PRODUCTS);
    const cachedVouchers = dataCache.get(CACHE_KEYS.VOUCHERS);
    const cachedPromos = dataCache.get(CACHE_KEYS.PROMOS);
    
    // Set cached data immediately
    if (cachedBanners?.success && Array.isArray(cachedBanners.data)) {
      setBanners(cachedBanners.data);
      setBannersLoading(false);
    }
    if (cachedCategories?.success && Array.isArray(cachedCategories.data)) {
      setCategories(cachedCategories.data);
      setCategoriesLoading(false);
    }

    // Parallel fetch semua data sekaligus
    const fetchData = async () => {
      const fetchPromises = [];
      
      // Banner
      if (!cachedBanners) {
        fetchPromises.push(
          apiService.get('/banner').then(data => {
            if (data?.success && Array.isArray(data.data)) {
              setBanners(data.data);
            }
            setBannersLoading(false);
          }).catch(() => setBannersLoading(false))
        );
      }
      
      // Categories
      if (!cachedCategories) {
        fetchPromises.push(
          apiService.get('/category').then(data => {
            if (data?.success && Array.isArray(data.data)) {
              setCategories(data.data);
            }
            setCategoriesLoading(false);
          }).catch(() => setCategoriesLoading(false))
        );
      }
      
      // Topup products
      if (!cachedTopup) {
        fetchPromises.push(
          apiService.get('/game?category=topup').then(data => {
            if (data?.success && Array.isArray(data.data)) {
              setTopupGames(data.data);
            }
            setTopupLoading(false);
          }).catch(() => setTopupLoading(false))
        );
      }
      
      // Steam products
      if (!cachedSteam) {
        fetchPromises.push(
          apiService.get('/game?category=steam').then(data => {
            if (data?.success && Array.isArray(data.data)) {
              setSteamKeys(data.data);
            }
            setSteamLoading(false);
          }).catch(() => setSteamLoading(false))
        );
      }
      
      // Minecraft products
      if (!cachedMinecraft) {
        fetchPromises.push(
          apiService.get('/category/minecraft').then(data => {
            if (data?.success && Array.isArray(data.products)) {
              setMinecraftProducts(data.products);
            } else if (data?.success && Array.isArray(data.data)) {
              setMinecraftProducts(data.data);
            }
            setMinecraftLoading(false);
          }).catch(() => setMinecraftLoading(false))
        );
      }
      
      // Vouchers
      if (!cachedVouchers) {
        fetchPromises.push(
          apiService.get('/voucher').then(data => {
            if (data?.success && Array.isArray(data.data)) {
              setVouchers(data.data);
            }
            setVoucherLoading(false);
          }).catch(() => setVoucherLoading(false))
        );
      }
      
      // Gift cards
      fetchPromises.push(
        apiService.get('/category/giftcard').then(data => {
          if (data?.success && Array.isArray(data.products)) {
            setGiftCards(data.products);
          } else if (data?.success && Array.isArray(data.data)) {
            setGiftCards(data.data);
          }
          setGiftcardLoading(false);
        }).catch(() => setGiftcardLoading(false))
      );
      
      // Promos
      if (!cachedPromos) {
        fetchPromises.push(
          apiService.get('/promo').then(data => {
            if (data?.success && Array.isArray(data.data)) {
              setPromos(data.data);
            }
            setPromoLoading(false);
          }).catch(() => setPromoLoading(false))
        );
      }

      // Wait semua request selesai (tidak perlu menunggu semua untuk render)
      await Promise.allSettled(fetchPromises);
    };

    fetchData();
  }, []);

  const toggleSection = useCallback((key) => {
    if (expandedSections[key]) {
      setClosingSections((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setClosingSections((prev) => ({ ...prev, [key]: false }));
        setExpandedSections((prev) => ({ ...prev, [key]: false }));
      }, 320);
    } else {
      setExpandedSections((prev) => ({ ...prev, [key]: true }));
    }
  }, [expandedSections]);

  const toggleMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const scrollCarousel = useCallback((refName, direction) => {
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
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ====================
  // NAVBAR - Memoized
  // ====================
  const renderNavbar = useMemo(() => (
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
  ), [menuOpen, user, navigate, toggleMenu, closeMenu, handleLogout]);

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
  const renderBanner = useMemo(() => (
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
                    <ImageWithFallback src={banner.image} alt={banner.alt || banner.title || 'Banner'} type="banner" />
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
          ) : bannersLoading ? (
            <SkeletonBanner count={1} />
          ) : (
            <div style={{ height: '180px' }}></div> // Empty placeholder
          )}
        </div>
      </div>
    </section>
  ), [banners, currentBannerIndex, bannersLoading]);

  // ====================
  // CATEGORY ICONS
  // ====================
  const renderCategories = useMemo(() => (
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
          ) : categoriesLoading ? (
            <SkeletonCategory count={8} />
          ) : null}
        </div>
      </div>
    </section>
  ), [categories, categoriesLoading]);

  // ====================
  // CAROUSEL SECTION
  // ====================
  const CarouselSection = memo(({ title, subtitle, data, gridClassName, isExpanded, isClosing, onToggle, onScrollPrev, onScrollNext }) => {
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
                onClick={onToggle}
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
              ) : null}
            </div>
          ) : (
            <div className="carousel-wrapper">
              <button className="carousel-btn carousel-prev" onClick={onScrollPrev}>
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
                ) : null}
              </div>
              <button className="carousel-btn carousel-next" onClick={onScrollNext}>
                ›
              </button>
            </div>
          )}
        </div>
      </section>
    );
  });

  // ====================
  // TOP UP GAMES SECTION
  // ====================
  const renderTopUpGames = useMemo(() => (
    <CarouselSection
      title="Top Up Games"
      subtitle="Produk Official GameKU - Mobile Legends, Free Fire, PUBG, Valorant, Roblox, Growtopia"
      data={topupGames}
      gridClassName="topup"
      isExpanded={!!expandedSections['topup']}
      isClosing={!!closingSections['topup']}
      onToggle={() => toggleSection('topup')}
      onScrollPrev={() => scrollCarousel('topup', -1)}
      onScrollNext={() => scrollCarousel('topup', 1)}
    />
  ), [topupGames, expandedSections, closingSections, toggleSection, scrollCarousel]);

  // ====================
  // STEAM KEYS SECTION
  // ====================
  const renderSteamKeys = useMemo(() => (
    <CarouselSection
      title="Random Steam Key"
      subtitle="Produk dari Marketplace Seller - Steam Wallet & Game Key"
      data={steamKeys}
      gridClassName="steam"
      isExpanded={!!expandedSections['steam']}
      isClosing={!!closingSections['steam']}
      onToggle={() => toggleSection('steam')}
      onScrollPrev={() => scrollCarousel('steam', -1)}
      onScrollNext={() => scrollCarousel('steam', 1)}
    />
  ), [steamKeys, expandedSections, closingSections, toggleSection, scrollCarousel]);

  // ====================
  // MINECRAFT SECTION
  // ====================
  const renderMinecraft = useMemo(() => (
    <CarouselSection
      title="Minecraft Marketplace"
      subtitle="Akun, Shared Account, Minecoin, Server, Jasa Build, Plugin, Resource Pack"
      data={minecraftProducts}
      gridClassName="minecraft"
      isExpanded={!!expandedSections['minecraft']}
      isClosing={!!closingSections['minecraft']}
      onToggle={() => toggleSection('minecraft')}
      onScrollPrev={() => scrollCarousel('minecraft', -1)}
      onScrollNext={() => scrollCarousel('minecraft', 1)}
    />
  ), [minecraftProducts, expandedSections, closingSections, toggleSection, scrollCarousel]);

  // ====================
  // VOUCHER SECTION
  // ====================
  const renderVoucherSection = useMemo(() => (
    <CarouselSection
      title="Voucher Game"
      subtitle="Voucher untuk berbagai platform game"
      data={vouchers}
      gridClassName="voucher"
      isExpanded={!!expandedSections['voucher']}
      isClosing={!!closingSections['voucher']}
      onToggle={() => toggleSection('voucher')}
      onScrollPrev={() => scrollCarousel('voucher', -1)}
      onScrollNext={() => scrollCarousel('voucher', 1)}
    />
  ), [vouchers, expandedSections, closingSections, toggleSection, scrollCarousel]);

  // ====================
  // GIFT CARD SECTION
  // ====================
  const renderGiftCardSection = useMemo(() => (
    <CarouselSection
      title="Gift Card"
      subtitle="Gift card untuk hiburan digital"
      data={giftCards}
      gridClassName="giftcard"
      isExpanded={!!expandedSections['giftcard']}
      isClosing={!!closingSections['giftcard']}
      onToggle={() => toggleSection('giftcard')}
      onScrollPrev={() => scrollCarousel('giftcard', -1)}
      onScrollNext={() => scrollCarousel('giftcard', 1)}
    />
  ), [giftCards, expandedSections, closingSections, toggleSection, scrollCarousel]);

  // ====================
  // PROMO SECTION
  // ====================
  const renderPromoSection = useMemo(() => (
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
            ) : null}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => scrollCarousel('promo', 1)}>
            ›
          </button>
        </div>
      </div>
    </section>
  ), [promos, scrollCarousel]);

  // ====================
  // FOOTER - Memoized
  // ====================
  const renderFooter = useMemo(() => (
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
  ), []);

  // ====================
  // RENDER
  // ====================
  return (
    <>
      {renderNavbar}
      {renderBanner}
      {renderCategories}
      {renderTopUpGames}
      {renderSteamKeys}
      {renderMinecraft}
      {renderVoucherSection}
      {renderGiftCardSection}
      {renderPromoSection}
      {renderFooter}
    </>
  );
}

export default memo(Home);