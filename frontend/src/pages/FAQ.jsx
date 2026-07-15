import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import assets from '../config/assetConfig';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'Bagaimana cara top up game?', a: 'Pilih game yang ingin di-top up, masukkan ID game, pilih nominal, lakukan pembayaran, dan diamond akan langsung masuk ke akun kamu secara otomatis.' },
    { q: 'Berapa lama proses top up?', a: 'Proses top up biasanya hanya membutuhkan waktu beberapa detik hingga maksimal 5 menit setelah pembayaran berhasil.' },
    { q: 'Apakah pembayaran aman?', a: 'Ya, semua transaksi di Gameku menggunakan sistem keamanan enkripsi dan diproses melalui payment gateway terpercaya.' },
    { q: 'Bagaimana jika top up tidak masuk?', a: 'Jika dalam waktu 30 menit top up belum masuk, silakan hubungi customer service kami melalui WhatsApp atau email untuk bantuan lebih lanjut.' },
    { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menerima berbagai metode pembayaran seperti transfer bank, e-wallet (GoPay, OVO, DANA), dan virtual account.' },
    { q: 'Apakah ada minimal pembelian?', a: 'Tidak ada minimal pembelian. Kamu bisa membeli produk dengan nominal berapa pun sesuai kebutuhan.' }
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
            <h1 className="section-title">FAQ</h1>
            <p className="section-subtitle">Pertanyaan yang sering diajukan</p>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ marginBottom: 12, background: 'var(--dark-2)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--dark-3)' }}>
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{ width: '100%', padding: '16px 20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 'var(--font-base)', color: 'var(--white)', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  {faq.q}
                  <span style={{ transition: 'transform 0.3s ease', transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </button>
                {openIndex === index && (
                  <div style={{ padding: '0 20px 16px', color: 'var(--gray-2)', fontSize: 'var(--font-sm)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQ;