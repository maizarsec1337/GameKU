import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import assets from '../config/assetConfig';
import '../css/home.css';

// ====================
// DUMMY DATA
// ====================

const dummyBanners = [
  { id: 1, image: assets.banner.hero1.file, alt: 'Banner 1' },
  { id: 2, image: assets.banner.hero2.file, alt: 'Banner 2' },
  { id: 3, image: assets.banner.hero3.file, alt: 'Banner 3' }
];

const dummyGames = [
  { id: 1, name: 'Mobile Legends', image: assets.game.mlbb.file, price: 'Rp15.000', category: 'Top Up' },
  { id: 2, name: 'Free Fire', image: assets.game.ff.file, price: 'Rp10.000', category: 'Top Up' },
  { id: 3, name: 'PUBG Mobile', image: assets.game.pubg.file, price: 'Rp20.000', category: 'Top Up' },
  { id: 4, name: 'Genshin Impact', image: assets.game.genshin.file, price: 'Rp25.000', category: 'Top Up' },
  { id: 5, name: 'Valorant', image: assets.game.valorant.file, price: 'Rp30.000', category: 'Top Up' },
  { id: 6, name: 'FIFA Mobile', image: assets.game.fifa.file, price: 'Rp12.000', category: 'Top Up' },
  { id: 7, name: 'Call of Duty Mobile', image: assets.game.cod.file, price: 'Rp18.000', category: 'Top Up' },
  { id: 8, name: 'League of Legends', image: assets.game.lol.file, price: 'Rp22.000', category: 'Top Up' }
];

const dummyVouchers = [
  { id: 1, name: 'Google Play', image: assets.voucher.googleplay.file, price: 'Rp20.000 - Rp500.000', category: 'Voucher' },
  { id: 2, name: 'PlayStation', image: assets.voucher.playstation.file, price: 'Rp50.000 - Rp1.000.000', category: 'Voucher' },
  { id: 3, name: 'Xbox', image: assets.voucher.xbox.file, price: 'Rp30.000 - Rp750.000', category: 'Voucher' },
  { id: 4, name: 'Nintendo', image: assets.voucher.nintendo.file, price: 'Rp25.000 - Rp600.000', category: 'Voucher' }
];

const dummySteam = [
  { id: 1, name: 'Steam Wallet Rp20.000', image: assets.steam.wallet.file, price: 'Rp20.000', category: 'Steam' },
  { id: 2, name: 'Steam Wallet Rp50.000', image: assets.steam.wallet.file, price: 'Rp50.000', category: 'Steam' },
  { id: 3, name: 'Steam Wallet Rp100.000', image: assets.steam.wallet.file, price: 'Rp100.000', category: 'Steam' },
  { id: 4, name: 'Steam Gift Card', image: assets.steam.giftcard.file, price: 'Rp75.000', category: 'Steam' }
];

const dummyGiftcards = [
  { id: 1, name: 'Apple iTunes', image: assets.giftcard.itunes.file, price: 'Rp50.000', category: 'Gift Card' },
  { id: 2, name: 'Spotify Premium', image: assets.giftcard.spotify.file, price: 'Rp30.000', category: 'Gift Card' },
  { id: 3, name: 'Netflix', image: assets.giftcard.netflix.file, price: 'Rp100.000', category: 'Gift Card' },
  { id: 4, name: 'YouTube Premium', image: assets.giftcard.youtube.file, price: 'Rp35.000', category: 'Gift Card' }
];

const dummyFlashSales = [
  { id: 1, name: 'MLBB 100 Diamonds', image: assets.game.mlbb.file, price: 'Rp15.000', originalPrice: 'Rp25.000', discount: 40 },
  { id: 2, name: 'FF 100 Diamonds', image: assets.game.ff.file, price: 'Rp10.000', originalPrice: 'Rp18.000', discount: 44 },
  { id: 3, name: 'PUBG 150 UC', image: assets.game.pubg.file, price: 'Rp20.000', originalPrice: 'Rp35.000', discount: 43 },
  { id: 4, name: 'Genshin 60 Primogems', image: assets.game.genshin.file, price: 'Rp25.000', originalPrice: 'Rp40.000', discount: 37 }
];

const dummyTestimonials = [
  { id: 1, name: 'Andi Pratama', role: 'Gamer', text: 'Pelayanan cepat dan terpercaya. Top up MLBB langsung masuk dalam hitungan detik. Sangat recommended!', initial: 'A' },
  { id: 2, name: 'Siti Rahma', role: 'Streamer', text: 'Harga termurah dibanding toko lain. Steam Wallet selalu ready. Langganan tetap di sini.', initial: 'S' },
  { id: 3, name: 'Budi Santoso', role: 'Kolektor', text: 'Gift Card lengkap dari semua platform. Pengiriman instan, customer service responsif.', initial: 'B' }
];

const dummyCategories = [
  { name: 'Top Up Game', icon: '🎮', count: '100+ Game', slug: 'topup' },
  { name: 'Voucher Game', icon: '🎟️', count: '50+ Voucher', slug: 'voucher' },
  { name: 'Steam Wallet', icon: '🪙', count: '10+ Produk', slug: 'steam' },
  { name: 'Gift Card', icon: '🎁', count: '20+ Pilihan', slug: 'giftcard' },
  { name: 'Membership', icon: '⭐', count: '2 Paket', slug: 'membership' },
  { name: 'Google Play', icon: '▶️', count: '5+ Nominal', slug: 'googleplay' },
  { name: 'PlayStation', icon: '🎮', count: '10+ Voucher', slug: 'playstation' },
  { name: 'Entertainment', icon: '🎬', count: '15+ Produk', slug: 'entertainment' }
];

const dummyBrands = ['Nintendo', 'PlayStation', 'Xbox', 'Steam', 'Google', 'Apple', 'Spotify', 'Netflix', 'Riot Games', 'Moonton', 'Garena', 'Tencent'];

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  // ====================
  // COUNTDOWN TIMER
  // ====================

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ====================
  // HANDLERS
  // ====================

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ====================
  // NAVBAR
  // ====================

  const renderNavbar = () => (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          <img src={assets.logo.main.file} alt={assets.logo.main.alt} width={assets.logo.main.width} height={assets.logo.main.height} />
          <span>Gameku</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="active" onClick={closeMenu}>Beranda</Link>
          <Link to="/category/topup" onClick={closeMenu}>Top Up</Link>
          <Link to="/category/voucher" onClick={closeMenu}>Voucher</Link>
          <Link to="/category/steam" onClick={closeMenu}>Steam</Link>
          <Link to="/promo" onClick={closeMenu}>Promo</Link>
          <Link to="/about" onClick={closeMenu}>Tentang</Link>
        </div>

        <div className="navbar-actions">
          <button className="btn-icon" aria-label="Search" onClick={() => navigate('/search')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button className="btn-icon" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-count">0</span>
          </button>

          <Link to="/login" className="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Masuk</span>
          </Link>

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
  // BANNER CAROUSEL
  // ====================

  const renderBanner = () => (
    <section className="banner-section">
      <div className="container">
        <div className="banner-carousel">
          {dummyBanners.map((banner) => (
            <div className="banner-slide" key={banner.id}>
              <img src={banner.image} alt={banner.alt} />
            </div>
          ))}
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
          {dummyCategories.map((cat, index) => (
            <Link to={`/category/${cat.slug}`} className="category-item" key={index}>
              <div className="category-icon-wrapper">
                <span className="category-emoji">{cat.icon}</span>
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  // ====================
  // TOP GAMES
  // ====================

  const renderTopGames = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Top 100 Games in One Place</h2>
          <p className="section-subtitle">
            Top up game favorit kamu dengan harga termurah dan proses cepat
          </p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => document.querySelector('.games-grid').scrollBy({left: -300, behavior: 'smooth'})}>
            ‹
          </button>
          <div className="games-grid">
            {dummyGames.map((game) => (
              <Link to={`/product/${game.id}`} className="game-card" key={game.id}>
                <div className="game-image-wrapper">
                  <img src={game.image} alt={game.name} />
                </div>
                <div className="game-info">
                  <h3>{game.name}</h3>
                  <p className="game-price">{game.price}</p>
                  <button className="btn btn-primary btn-sm">Beli Sekarang</button>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => document.querySelector('.games-grid').scrollBy({left: 300, behavior: 'smooth'})}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // STEAM WALLET
  // ====================

  const renderSteam = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Random Steam Key</h2>
          <p className="section-subtitle">
            Steam Wallet dan Gift Card dengan harga terbaik
          </p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => document.querySelector('.steam-grid').scrollBy({left: -300, behavior: 'smooth'})}>
            ‹
          </button>
          <div className="steam-grid">
            {dummySteam.map((item) => (
              <Link to={`/product/${item.id}`} className="steam-card" key={item.id}>
                <div className="steam-image-wrapper">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="steam-info">
                  <h3>{item.name}</h3>
                  <p className="steam-price">{item.price}</p>
                  <button className="btn btn-primary btn-sm">Beli</button>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => document.querySelector('.steam-grid').scrollBy({left: 300, behavior: 'smooth'})}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // GIFT CARD
  // ====================

  const renderGiftCard = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Popular Gaming Gift Card</h2>
          <p className="section-subtitle">
            Gift card untuk layanan digital favorit kamu
          </p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => document.querySelector('.giftcard-grid').scrollBy({left: -300, behavior: 'smooth'})}>
            ‹
          </button>
          <div className="giftcard-grid">
            {dummyGiftcards.map((item) => (
              <Link to={`/product/${item.id}`} className="giftcard-card" key={item.id}>
                <div className="giftcard-image-wrapper">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="giftcard-info">
                  <h3>{item.name}</h3>
                  <p className="giftcard-price">{item.price}</p>
                  <button className="btn btn-primary btn-sm">Beli</button>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => document.querySelector('.giftcard-grid').scrollBy({left: 300, behavior: 'smooth'})}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // VOUCHER
  // ====================

  const renderVoucher = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Voucher Game</h2>
          <p className="section-subtitle">
            Voucher game dari berbagai platform favorit kamu
          </p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => document.querySelector('.voucher-grid').scrollBy({left: -300, behavior: 'smooth'})}>
            ‹
          </button>
          <div className="voucher-grid">
            {dummyVouchers.map((voucher) => (
              <Link to={`/product/${voucher.id}`} className="voucher-card" key={voucher.id}>
                <div className="voucher-image-wrapper">
                  <img src={voucher.image} alt={voucher.name} />
                </div>
                <div className="voucher-info">
                  <h3>{voucher.name}</h3>
                  <p className="voucher-price-range">{voucher.price}</p>
                  <button className="btn btn-primary btn-sm">Beli</button>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => document.querySelector('.voucher-grid').scrollBy({left: 300, behavior: 'smooth'})}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // TOP UP SECTION
  // ====================

  const renderTopUp = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Top Up</h2>
          <p className="section-subtitle">
            Top up game favorit kamu dengan harga termurah
          </p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => document.querySelector('.topup-grid').scrollBy({left: -300, behavior: 'smooth'})}>
            ‹
          </button>
          <div className="topup-grid">
            {dummyGames.slice(0, 6).map((game) => (
              <Link to={`/product/${game.id}`} className="topup-card" key={game.id}>
                <div className="topup-image-wrapper">
                  <img src={game.image} alt={game.name} />
                </div>
                <div className="topup-info">
                  <h3>{game.name}</h3>
                  <p className="topup-price">{game.price}</p>
                  <button className="btn btn-primary btn-sm">Beli</button>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => document.querySelector('.topup-grid').scrollBy({left: 300, behavior: 'smooth'})}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // MORE GAMES
  // ====================

  const renderMoreGames = () => (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Top 100 Games</h2>
          <p className="section-subtitle">
            Lebih banyak game favorit lainnya
          </p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={() => document.querySelector('.games-grid-large').scrollBy({left: -300, behavior: 'smooth'})}>
            ‹
          </button>
          <div className="games-grid-large">
            {dummyGames.map((game) => (
              <Link to={`/product/${game.id}`} className="game-card-large" key={game.id}>
                <div className="game-image-wrapper">
                  <img src={game.image} alt={game.name} />
                </div>
                <div className="game-info">
                  <h3>{game.name}</h3>
                  <p className="game-price">{game.price}</p>
                  <button className="btn btn-primary btn-sm">Beli Sekarang</button>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-btn carousel-next" onClick={() => document.querySelector('.games-grid-large').scrollBy({left: 300, behavior: 'smooth'})}>
            ›
          </button>
        </div>
      </div>
    </section>
  );

  // ====================
  // FEATURES
  // ====================

  const renderFeatures = () => (
    <section className="section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Proses Instan</h3>
            <p>Top up dan voucher langsung masuk ke akun kamu dalam hitungan detik</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>100% Aman</h3>
            <p>Transaksi aman dengan sistem enkripsi dan terpercaya</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Support 24/7</h3>
            <p>Customer service siap membantu kamu kapan saja</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Harga Termurah</h3>
            <p>Harga terbaik dan termurah dibanding toko lainnya</p>
          </div>
        </div>
      </div>
    </section>
  );

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
              Membership, dan berbagai kebutuhan digital lainnya dengan harga terbaik.
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
              <li><Link to="/category/membership">Membership</Link></li>
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
              <li><a href="mailto:support@gameku.com">support@gameku.com</a></li>
              <li><a href="tel:+6281234567890">+62 812-3456-7890</a></li>
              <li style={{ fontSize: 'var(--font-xs)', color: 'rgba(255,255,255,0.5)', marginTop: 'var(--space-md)' }}>
                Senin - Sabtu<br />
                09:00 - 21:00 WIB
              </li>
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
      {renderTopGames()}
      {renderSteam()}
      {renderGiftCard()}
      {renderVoucher()}
      {renderTopUp()}
      {renderMoreGames()}
      {renderFeatures()}
      {renderFooter()}
    </>
  );
}

export default Home;