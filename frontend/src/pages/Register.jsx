import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function Register() {
  return (
    <div className="page-placeholder" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: 400, width: '100%', background: 'var(--dark-2)', borderRadius: 'var(--radius-lg)', padding: 40, color: 'var(--white)', border: '1px solid var(--dark-3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={assets.logo.main.file} alt={assets.logo.main.alt} width={120} height={36} style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>Gameku</h1>
          <p style={{ color: 'var(--gray-2)', fontSize: 'var(--font-sm)' }}>Buat akun baru</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--gray-2)' }}>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--dark-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-base)', background: 'var(--dark-3)', color: 'var(--white)' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--gray-2)' }}>Email</label>
            <input type="email" placeholder="Masukkan email" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--dark-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-base)', background: 'var(--dark-3)', color: 'var(--white)' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--gray-2)' }}>Password</label>
            <input type="password" placeholder="Masukkan password" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--dark-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-base)', background: 'var(--dark-3)', color: 'var(--white)' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--gray-2)' }}>Konfirmasi Password</label>
            <input type="password" placeholder="Konfirmasi password" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--dark-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-base)', background: 'var(--dark-3)', color: 'var(--white)' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Daftar</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-2)' }}>Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Masuk</Link></p>
          <Link to="/" style={{ display: 'inline-block', marginTop: 12, fontSize: 'var(--font-sm)', color: 'var(--gray-2)' }}>Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;