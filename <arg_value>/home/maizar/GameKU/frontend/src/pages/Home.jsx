import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/apiService';
import { dataCache, CACHE_KEYS } from '../services/dataCache';
import { SkeletonBanner, SkeletonCategory, SkeletonProductCard, SkeletonPromo } from '../components/SkeletonLoader';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Dynamic data state
  const [homeData, setHomeData] = useState({ categories: [], sections: {}, banners: [], promos: [] });
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState({});
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const carouselRefs = {
    banner: React.useRef(null)
  };

  // State untuk mode "Lihat Semua" (carousel <-> grid) per section
  const [expandedSections, setExpandedSections] = useState({});
  const [closingSections, setClosingSections] = useState({});

  // Polling interval for real-time updates (30 second refresh)
  useEffect(() => {
    const cacheKey = 'home';
    
    // Check cache first
    const cached = dataCache.get(cacheKey);
    if (cached && cached.categories) {
      setHomeData(cached);
      setLoading(false);
      setBannersLoading(false);
      setCategoriesLoading(false);
    }

    // Fetch fresh data
    const fetchHomeData = async () => {
      try {
        const data = await apiService.get('/home', true);
        if (data?.success && data.data) {
          setHomeData(data.data);
          dataCache.set(cacheKey, data.data);
        }
      } catch (error) {
        console.error('Home data fetch error:', error);
      } finally {
        setLoading(false);
        setBannersLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchHomeData();

    // Set up polling every 30 seconds for new products
    const pollInterval = setInterval(fetchHomeData, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  // Set loading state for sections when data is available
  useEffect(() => {
    const loadingState = {};
    Object.keys(homeData.sections).forEach(key => {
      loadingState[key] = false;
    });
    setSectionsLoading(loadingState);
  }, [homeData.sections]);

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
      const card = ref.current.querySelector('.product-card');
      if (card) {
        const cardWidth = card.offsetWidth;
        const gap = 8;
        ref.current.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
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
          <img src="/gambar/logo/Glogo.png" alt="Gameku Icon" width={28} height={28} style={{ objectFit: 'contain' }} />
          <span>Gameku</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="active" onClick={closeMenu}>Beranda</Link>
          {homeData.categories.map((cat) => (
            <Link key={cat._id || cat.id} to={`/category/${cat.slug}`} onClick={closeMenu}>
              {cat.name}
            </Link>
          ))}
          {homeData.categories.length === 0 && (
            <>
              <Link to="/category/topup" onClick={closeMenu}>Top Up</Link>
              <Link to="/category/voucher" onClick={closeMenu}>Voucher</Link>
              <Link to="/category/steam" onClick={closeMenu}>Steam</Link>
              <Link to="/category/minecraft" onClick={closeMenu}>Minecraft</Link>
            </>
          )}
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
  ), [menuOpen, user, navigate, toggleMenu, closeMenu, handleLogout, homeData.categories]);

  // ====================
  // BANNER AUTO SLIDE
  // ====================
  useEffect(() => {
    if (homeData.banners && homeData.banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % homeData.banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [homeData.banners?.length]);

  // ====================
  // BANNER CAROUSEL
  // ====================
  const renderBanner = useMemo(() => (
    <section className="banner-section">
      <div className="container">
        <div className="banner-carousel" ref={carouselRefs.banner}>
          {homeData.banners && homeData.banners.length > 0 ? (
            <>
              <div className="banner-slider" style={{
                display: 'flex',
                transform: `translateX(-${currentBannerIndex * 100}%)`,
                transition: 'transform 0.5s ease-in-out',
                width: '100%'
              }}>
                {homeData.banners.map((banner, index) => (
                  <div className="banner-slide" key={banner._id || banner.id || index}>
                    <ImageWithFallback src={banner.image || banner.src} alt={banner.alt || banner.title || 'Banner'} type="banner" />
                  </div>
                ))}
              </div>
              <div className="banner-indicators">
                {homeData.banners.map((_, index) => (
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
            <div style={{ height: '180px' }}></div>
          )}
        </div>
      </div>
    </section>
  ), [homeData.banners, currentBannerIndex, bannersLoading]);

  // ====================
  // CATEGORY ICONS
  // ====================
  const renderCategories = useMemo(() => (
    <section className="section-categories">
      <div className="container">
        <div className="categories-row">
          {homeData.categories.length > 0 ? (
            homeData.categories.map((cat, index) => (
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
  ), [homeData.categories, categoriesLoading]);

  // ====================
  // DYNAMIC CAROUSEL SECTION
  // ====================
  const DynamicSection = memo(({ sectionKey, sectionData, onToggle, onScrollPrev, onScrollNext, isExpanded, isClosing }) => {
    if (!sectionData || !sectionData.products || sectionData.products.length === 0) return null;
    
    return (
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-flex">
              <div className="section-title-wrapper">
                <h2 className="section-title">{sectionData.title}</h2>
                {sectionData.subtitle && <p className="section-subtitle">{sectionData.subtitle}</p>}
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
            <div className={`product-grid ${sectionKey} ${isClosing ? 'grid-closing' : 'grid-opening'}`} key={sectionKey}>
              {sectionData.products.length > 0 ? (
                sectionData.products.map((item) => (
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
                ))
              ) : null}
            </div>
          ) : (
            <div className="carousel-wrapper">
              <button className="carousel-btn carousel-prev" onClick={onScrollPrev}>
                ‹
              </button>
              <div className={`product-carousel ${sectionKey}`} ref={carouselRefs[sectionKey]}>
                {sectionData.products.length > 0 ? (
                  sectionData.products.map((item) => (
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
  // RENDER SECTIONS DYNAMICALLY
  // ====================
  const renderSections = useMemo(() => {
    return Object.entries(homeData.sections || {}).map(([sectionKey, sectionData]) => (
      <DynamicSection
        key={sectionKey}
        sectionKey={sectionKey}
        sectionData={sectionData}
        isExpanded={!!expandedSections[sectionKey]}
        isClosing={!!closingSections[sectionKey]}
        onToggle={() => toggleSection(sectionKey)}
        onScrollPrev={() => scrollCarousel(sectionKey, -1)}
        onScrollNext={() => scrollCarousel(sectionKey, 1)}
      />
    ));
  }, [homeData.sections, expandedSections, closingSections, toggleSection, scrollCarousel]);

  // ====================
  // PROMO SECTION
  // ====================
  const renderPromoSection = useMemo(() => {
    const promoProducts = homeData.promos?.filter(p => p.products)?.flatMap(p => p.products) || [];
    
    if (promoProducts.length === 0) return null;

    return (
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
              {promoProducts.length > 0 ? (
                promoProducts.map((item) => (
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
                ))
              ) : null}
            </div>
            <button className="carousel-btn carousel-next" onClick={() => scrollCarousel('promo', 1)}>
              ›
            </button>
          </div>
        </div>
      </section>
    );
  }, [homeData.promos, scrollCarousel]);

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
              {homeData.categories.length > 0 ? (
                homeData.categories.map((cat) => (
                  <li key={cat._id || cat.id}>
                    <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/category/topup">Top Up Game</Link></li>
                  <li><Link to="/category/voucher">Voucher Game</Link></li>
                  <li><Link to="/category/steam">Steam Wallet</Link></li>
                  <li><Link to="/category/giftcard">Gift Card</Link></li>
                  <li><Link to="/category/minecraft">Minecraft</Link></li>
                </>
              )}
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
  ), [homeData.categories]);

  // ====================
  // RENDER
  // ====================
  return (
    <>
      {renderNavbar}
      {renderBanner}
      {renderCategories}
      {renderSections}
      {renderPromoSection}
      {renderFooter}
    </>
  );
}

export default memo(Home);