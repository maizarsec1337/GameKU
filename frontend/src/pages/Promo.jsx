import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';
import ProductCard from '../components/ProductCard';
import ImageWithFallback from '../components/ImageWithFallback';
function Promo() {
  const promos = [
    { id: 501, title: 'Bonus Top Up 100%', desc: 'Setiap pembelian pertama dapat bonus diamond hingga 100%', color: '#6C5CE7', image: assets.promo.bonus.file },
    { id: 502, title: 'Diskon Member Baru', desc: 'Dapatkan diskon 20% untuk pembelian pertama kamu', color: '#00CEC9', image: assets.promo.flashsale.file },
    { id: 503, title: 'Flash Sale Akhir Pekan', desc: 'Diskon hingga 70% setiap akhir pekan', color: '#E17055', image: assets.promo.flashsale.file },
    { id: 504, title: 'Cashback 10%', desc: 'Dapatkan cashback 10% untuk setiap transaksi', color: '#00B894', image: assets.promo.bonus.file }
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
            <h1 className="section-title">Promo Spesial</h1>
            <p className="section-subtitle">Jangan lewatkan promo-promo menarik dari Gameku</p>
          </div>
          <div className="product-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
            {promos.map((promo) => (
              <div key={promo.id} className="feature-card" style={{ background: promo.color }}>
                <ImageWithFallback src={promo.image} alt={promo.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
                <div style={{ padding: 'var(--space-lg)' }}>
                  <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--white)', marginBottom: 'var(--space-sm)' }}>{promo.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--space-md)' }}>{promo.desc}</p>
                  <button className="btn btn-primary btn-sm">Klaim Sekarang</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Promo;