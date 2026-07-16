import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function Privacy() {
  return (
    <>
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
            <Link to="/login" className="btn btn-primary btn-sm">Masuk</Link>
          </div>
        </div>
      </nav>
      <div className="section" style={{ paddingTop: 100 }}>
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">Kebijakan Privasi</h1>
            <p className="section-subtitle">Bagaimana kami melindungi data kamu</p>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--dark-2)', padding: 40, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--dark-3)' }}>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>1. Informasi yang Kami Kumpulkan</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Kami mengumpulkan informasi yang kamu berikan saat mendaftar, seperti nama, email, dan nomor telepon. Kami juga mengumpulkan data transaksi untuk memproses pesanan kamu.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>2. Penggunaan Informasi</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Informasi yang kami kumpulkan digunakan untuk memproses transaksi, memberikan layanan pelanggan, mengirimkan notifikasi promo, dan meningkatkan kualitas layanan kami.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>3. Keamanan Data</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang tepat untuk melindungi data pribadi kamu dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>4. Cookie</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Kami menggunakan cookie untuk meningkatkan pengalaman browsing kamu. Cookie membantu kami mengingat preferensi dan memahami bagaimana kamu menggunakan situs kami.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>5. Kontak</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8 }}>Jika kamu memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di support@gameku.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Privacy;