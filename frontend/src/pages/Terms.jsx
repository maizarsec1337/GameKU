import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function Terms() {
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
            <h1 className="section-title">Syarat & Ketentuan</h1>
            <p className="section-subtitle">Aturan penggunaan layanan Gameku</p>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--dark-2)', padding: 40, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--dark-3)' }}>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>1. Penerimaan Ketentuan</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Dengan menggunakan layanan Gameku, kamu menyetujui syarat dan ketentuan yang berlaku. Jika kamu tidak setuju, mohon untuk tidak menggunakan layanan kami.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>2. Pendaftaran Akun</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Kamu bertanggung jawab untuk menjaga kerahasiaan informasi akun dan password. Semua aktivitas yang terjadi di akun kamu adalah tanggung jawab kamu.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>3. Transaksi</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Semua transaksi bersifat final setelah diproses. Pastikan data yang dimasukkan benar sebelum melakukan pembayaran. Refund hanya berlaku untuk kesalahan dari sistem kami.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>4. Penggunaan Layanan</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 24 }}>Kami berhak menolak layanan kepada siapa pun karena alasan tertentu. Dilarang menggunakan layanan untuk tujuan ilegal atau melanggar hukum.</p>
            <h3 style={{ marginBottom: 12, fontSize: 'var(--font-lg)', color: 'var(--white)' }}>5. Perubahan Ketentuan</h3>
            <p style={{ color: 'var(--gray-2)', lineHeight: 1.8 }}>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui situs kami. Penggunaan lanjutan setelah perubahan berarti kamu menyetujui perubahan tersebut.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Terms;