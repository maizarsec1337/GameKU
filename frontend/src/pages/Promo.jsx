import React from 'react';
import { Link } from 'react-router-dom';

function Promo() {
  const promos = [
    { title: 'Bonus Top Up 100%', desc: 'Setiap pembelian pertama dapat bonus diamond hingga 100%', color: '#6C5CE7' },
    { title: 'Diskon Member Baru', desc: 'Dapatkan diskon 20% untuk pembelian pertama kamu', color: '#00CEC9' },
    { title: 'Flash Sale Akhir Pekan', desc: 'Diskon hingga 70% setiap akhir pekan', color: '#E17055' },
    { title: 'Cashback 10%', desc: 'Dapatkan cashback 10% untuk setiap transaksi', color: '#00B894' }
  ];

  return (
    <>
      <nav className="navbar" style={{ position: 'relative' }}>
        <div className="container">
          <Link to="/" className="navbar-logo">
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
          <div className="promo-grid">
            {promos.map((promo, index) => (
              <div key={index} className="promo-card" style={{ background: promo.color, minHeight: 200, padding: 40 }}>
                <div className="promo-card-content" style={{ maxWidth: '100%' }}>
                  <h3 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'white', marginBottom: 8 }}>{promo.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>{promo.desc}</p>
                  <button className="btn btn-white">Klaim Sekarang</button>
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