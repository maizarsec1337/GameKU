import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="page-placeholder" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: 400, width: '100%', background: 'white', borderRadius: 16, padding: 40, color: '#2D3436' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>Gameku</h1>
          <p style={{ color: '#888', fontSize: 14 }}>Buat akun baru</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Email</label>
            <input type="email" placeholder="Masukkan email" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Password</label>
            <input type="password" placeholder="Masukkan password" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' }}>Konfirmasi Password</label>
            <input type="password" placeholder="Konfirmasi password" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Daftar</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#888' }}>Sudah punya akun? <Link to="/login" style={{ color: '#6C5CE7', fontWeight: 600 }}>Masuk</Link></p>
          <Link to="/" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#888' }}>Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;