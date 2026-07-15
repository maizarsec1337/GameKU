import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function About() {
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
            <h1 className="section-title">Tentang Gameku</h1>
            <p className="section-subtitle">Platform digital gaming store terpercaya di Indonesia</p>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="feature-card" style={{ textAlign: 'left', padding: 'var(--space-xl)', marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: 16, color: 'var(--white)' }}>Visi Kami</h3>
              <p style={{ color: 'var(--gray-2)', lineHeight: 1.8 }}>Menjadi platform digital gaming store nomor satu di Indonesia yang menyediakan layanan top up game, voucher game, steam wallet, gift card, membership, dan kebutuhan digital lainnya dengan harga terbaik dan pelayanan tercepat.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left', padding: 'var(--space-xl)', marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: 16, color: 'var(--white)' }}>Misi Kami</h3>
              <p style={{ color: 'var(--gray-2)', lineHeight: 1.8 }}>Memberikan pengalaman berbelanja digital terbaik dengan harga termurah, proses instan, dan customer service yang responsif 24/7. Kami berkomitmen untuk terus berkembang dan memberikan layanan terbaik bagi seluruh pelanggan setia Gameku.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left', padding: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: 16, color: 'var(--white)' }}>Mengapa Gameku?</h3>
              <p style={{ color: 'var(--gray-2)', lineHeight: 1.8 }}>Gameku menawarkan berbagai keunggulan seperti harga termurah, proses instan, 100% aman, support 24/7, dan produk lengkap dari berbagai brand ternama. Kami telah melayani ribuan transaksi dengan tingkat kepuasan pelanggan yang tinggi.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;