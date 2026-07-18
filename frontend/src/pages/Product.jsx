import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import assets from '../config/assetConfig';
import {
  getProduct,
  getRelated,
  getYouMayLike,
  getReviews,
  getFaqs,
  getSeller,
  fmt
} from '../config/productData';
import ImageWithFallback from '../components/ImageWithFallback';
import '../css/product.css';

/* Ikon inline (identitas Gameku, bukan copy Itemku) */
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const IconHeadset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="2" y="14" width="5" height="7" rx="1.5" />
    <rect x="17" y="14" width="5" height="7" rx="1.5" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconEmoji = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const QUICK_EMOJIS = ['😊', '👍', '🎮', '🔥', '💰', '🙏', '😍', '⚡'];

function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span className="pd-stars">
      {Array.from({ length: 5 }).map((_, i) =>
        i < full ? <IconStar key={i} /> : <span key={i} style={{ opacity: 0.25, color: 'var(--primary)' }}>★</span>
      )}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    online: { cls: 'online', label: 'Online', dot: 'var(--success)' },
    offline: { cls: 'offline', label: 'Offline', dot: 'var(--gray)' },
    reply: { cls: 'reply', label: 'Membalas dalam ±5 menit', dot: 'var(--primary)' }
  };
  const s = map[status] || map.offline;
  return (
    <span className={`pd-status-badge ${s.cls}`}>
      <span className="pd-status-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = React.useRef(null);

  return (
    <div className={`pd-accordion ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="pd-accordion-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="pd-accordion-icon"><IconChevron /></span>
      </button>
      <div
        className="pd-accordion-body"
        ref={bodyRef}
        style={{ maxHeight: open ? `${bodyRef.current ? bodyRef.current.scrollHeight : 1000}px` : 0 }}
      >
        <div className="pd-accordion-body-inner">{children}</div>
      </div>
    </div>
  );
}

/* ==================== CHAT PANEL ==================== */
function ChatPanel({ open, onClose, peer, variant }) {
  const isSeller = variant === 'seller';
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (open) {
      const greeting = isSeller
        ? `Halo! Saya ${peer?.name || 'Seller'}. Ada yang bisa saya bantu terkait produk ini?`
        : 'Halo! Saya Customer Support Gameku. Ada yang bisa saya bantu?';
      setMessages([
        { id: 1, side: 'left', type: 'text', content: greeting, time: '09:00' }
      ]);
      setText('');
      setShowEmoji(false);
    }
  }, [open, isSeller, peer]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (!open) return null;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const send = () => {
    const val = text.trim();
    if (!val) return;
    setMessages((m) => [...m, { id: Date.now(), side: 'right', type: 'text', content: val, time: timeStr }]);
    setText('');
    setShowEmoji(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMessages((m) => [...m, { id: Date.now(), side: 'right', type: 'image', content: url, time: timeStr }]);
    e.target.value = '';
  };

  const addEmoji = (em) => {
    setText((t) => t + em);
    setShowEmoji(false);
  };

  return (
    <div className="pd-chat-overlay" onClick={onClose}>
      <aside className="pd-chat-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Chat">
        <header className="pd-chat-header">
          <div className="pd-chat-avatar">
            <ImageWithFallback src={isSeller ? peer?.avatar : assets.logo.icon.file} alt={peer?.name} />
          </div>
          <div className="pd-chat-head-info">
            <div className="pd-chat-name">{isSeller ? peer?.name : 'Customer Support'}</div>
            <StatusBadge status={isSeller ? peer?.status : 'online'} />
            <div className="pd-chat-last">Terakhir aktif: {isSeller ? (peer?.lastActive || '-') : 'Sekarang'}</div>
          </div>
          <button type="button" className="pd-chat-close" onClick={onClose} aria-label="Tutup">
            <IconClose />
          </button>
        </header>

        <div className="pd-chat-body" ref={bodyRef}>
          {messages.map((m) => (
            <div key={m.id} className={`pd-chat-row ${m.side}`}>
              {m.type === 'text' ? (
                <div className="pd-chat-bubble">{m.content}</div>
              ) : (
                <div className="pd-chat-bubble pd-chat-bubble-img">
                  <img src={m.content} alt="lampiran" />
                </div>
              )}
              <span className="pd-chat-time">{m.time}</span>
            </div>
          ))}
        </div>

        <div className="pd-chat-input">
          {showEmoji && (
            <div className="pd-chat-emoji">
              {QUICK_EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => addEmoji(em)}>{em}</button>
              ))}
            </div>
          )}
          <div className="pd-chat-input-row">
            <button type="button" className="pd-chat-tool" onClick={() => fileRef.current && fileRef.current.click()} aria-label="Unggah gambar">
              <IconImage />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onImage} />
            <button type="button" className="pd-chat-tool" onClick={() => setShowEmoji((s) => !s)} aria-label="Emoji">
              <IconEmoji />
            </button>
            <input
              className="pd-chat-text"
              type="text"
              placeholder="Tulis pesan..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKey}
            />
            <button type="button" className="pd-chat-send" onClick={send} aria-label="Kirim">
              <IconSend />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Product() {
  const { id } = useParams();
  const productId = parseInt(id, 10);

  const product = useMemo(() => getProduct(productId), [productId]);
  const related = useMemo(() => getRelated(product), [product]);
  const youMayLike = useMemo(() => getYouMayLike(product), [product]);
  const reviews = useMemo(() => getReviews(), []);
  const faqs = useMemo(() => getFaqs(), []);
  const seller = useMemo(() => getSeller(product), [product]);

  // State lokal
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedNominal, setSelectedNominal] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [chat, setChat] = useState(null); // 'seller' | 'cs' | null

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="pd-notfound">
            <h1>Produk Tidak Ditemukan</h1>
            <p>Maaf, produk yang kamu cari tidak tersedia atau telah dihapus.</p>
            <Link to="/" className="btn btn-primary btn-lg">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length ? product.images : [product.image];
  const nominal = product.nominals[selectedNominal] || product.nominals[0];
  const unitPrice = nominal ? nominal.price : product.basePrice;
  const total = unitPrice * qty;

  const toggleWishlist = () => setWishlisted((w) => !w);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: product.name, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const goToProduct = (pid) => {
    setActiveImg(0);
    setQty(1);
    setSelectedNominal(0);
  };

  const chatPeer = chat === 'seller' ? seller : { name: 'Customer Support Gameku' };

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">Beranda</Link>
          <span className="sep">/</span>
          <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link>
          <span className="sep">/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="pd-layout">
          {/* ==================== KIRI (70%) ==================== */}
          <div className="pd-left">
            {/* Gallery */}
            <div className="pd-gallery">
              <div className="pd-main-image">
                <ImageWithFallback
                  key={activeImg}
                  src={images[activeImg]}
                  alt={product.name}
                  className="pd-fade-img"
                />
              </div>
              {images.length > 1 && (
                <div className="pd-thumb-row">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`pd-thumb ${idx === activeImg ? 'active' : ''}`}
                      onClick={() => setActiveImg(idx)}
                      aria-label={`Gambar ${idx + 1}`}
                    >
                      <ImageWithFallback src={img} alt={`${product.name} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Produk */}
            <div className="pd-info-block">
              <h1 className="pd-title">{product.name}</h1>

              <div className="pd-meta-row">
                <span className="pd-rating">
                  <Stars value={product.rating} />
                  <span className="pd-rating-value">{product.rating}</span>
                  <span className="pd-review-count">({product.reviewCount} ulasan)</span>
                </span>
                {seller && (
                  <span className="pd-meta-seller">Dijual oleh <strong>{seller.name}</strong></span>
                )}
              </div>

              <div className="pd-badges">
                <span className="pd-badge pd-badge-official">
                  <IconCheck /> Produk Resmi
                </span>
                <span className="pd-badge pd-badge-verified">
                  <IconShield /> Gameku Verified
                </span>
                {seller && (
                  <span className="pd-badge pd-badge-seller">
                    <IconChat /> Seller Pihak Ketiga
                  </span>
                )}
              </div>

              <div className="pd-spec">
                <div className="pd-spec-item">
                  <span className="pd-spec-label">Kategori</span>
                  <span className="pd-spec-value">{product.category}</span>
                </div>
                <div className="pd-spec-item">
                  <span className="pd-spec-label">Platform</span>
                  <span className="pd-spec-value">{product.platform}</span>
                </div>
                <div className="pd-spec-item">
                  <span className="pd-spec-label">Region</span>
                  <span className="pd-spec-value">{product.region}</span>
                </div>
                <div className="pd-spec-item">
                  <span className="pd-spec-label">Status Stok</span>
                  <span className="pd-spec-value in-stock">{product.stock}</span>
                </div>
                <div className="pd-spec-item">
                  <span className="pd-spec-label">Estimasi Proses</span>
                  <span className="pd-spec-value">{product.processTime}</span>
                </div>
                <div className="pd-spec-item">
                  <span className="pd-spec-label">Rating</span>
                  <span className="pd-spec-value">{product.rating} / 5</span>
                </div>
              </div>

              <p className="pd-short-info">{product.shortInfo}</p>
            </div>

            {/* Deskripsi Produk - Accordion */}
            <h2 className="pd-section-title">Deskripsi Produk</h2>
            <Accordion title="Penjelasan Produk" defaultOpen>
              <p>{product.description}</p>
            </Accordion>
            <Accordion title="Cara Pembelian">
              <ul>
                <li>Pilih nominal / paket yang kamu inginkan di panel pembelian.</li>
                <li>Tentukan jumlah (quantity) sesuai kebutuhan.</li>
                <li>Klik <strong>Beli Sekarang</strong> atau <strong>Tambah ke Keranjang</strong>.</li>
                <li>Lakukan pembayaran melalui metode yang tersedia.</li>
                <li>Produk akan diproses otomatis setelah pembayaran berhasil.</li>
              </ul>
            </Accordion>
            <Accordion title="Cara Redeem">
              <ul>
                <li>Setelah pembayaran berhasil, kode redeem akan dikirim ke halaman transaksi kamu.</li>
                <li>Buka aplikasi / platform terkait dan masuk ke menu <em>Redeem</em> atau <em>Top Up</em>.</li>
                <li>Masukkan kode atau ikuti instruksi yang ditampilkan.</li>
                <li>Saldo / item akan langsung masuk ke akun kamu.</li>
              </ul>
            </Accordion>
            <Accordion title="Ketentuan">
              <ul>
                <li>Produk hanya berlaku untuk region yang tertera.</li>
                <li>Pastikan data akun tujuan sudah benar sebelum checkout.</li>
                <li>Transaksi bersifat final setelah item berhasil dikirimkan.</li>
                <li>Gameku tidak bertanggung jawab atas kesalahan input akun dari pembeli.</li>
              </ul>
            </Accordion>
            <Accordion title="Informasi Tambahan">
              <p>
                Gameku merupakan platform digital gaming store resmi dan terverifikasi di Indonesia.
                Seluruh produk diproses dengan sistem otomatis dan didukung layanan customer service 24/7.
                Untuk bantuan lebih lanjut, silakan hubungi tim support kami melalui halaman kontak.
              </p>
            </Accordion>

              {/* Review Pembeli */}
      <h2 className="pd-section-title">Review Pembeli</h2>
      <div className="pd-review-summary">
        <div className="pd-review-big">
          <div className="pd-review-score">{product.rating}</div>
          <div className="pd-review-count-big">dari 5.0</div>
        </div>
        <div className="pd-rating-bar">
          {[5, 4, 3, 2, 1].map((star) => {
            const percent = (star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2);
            return (
              <div className="pd-rating-bar-item" key={star}>
                <span className="pd-rating-bar-label">{star}</span>
                <div className="pd-rating-bar-track">
                  <div className="pd-rating-bar-fill" style={{ width: `${percent}%` }} />
                </div>
                <span className="pd-rating-bar-percent">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pd-review-list">
        {reviews.map((r, i) => (
          <div className="pd-review-item" key={i}>
            <div className="pd-review-head">
              <div className="pd-review-avatar">
                <ImageWithFallback src={r.avatar} alt={r.name} />
              </div>
              <div>
                <div className="pd-review-user">{r.name}</div>
                <div className="pd-review-date">{r.date} • <Stars value={r.rating} /></div>
              </div>
            </div>
            <p className="pd-review-comment">{r.comment}</p>
            {i === 0 && (
              <div className="pd-review-seller-reply">
                <div className="pd-review-seller-reply-head">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4v7" />
                    <path d="M20 20v-7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                  Penjual
                </div>
                <p className="pd-review-seller-reply-text">
                  Terima kasih atas ulasan Anda! Kami senang bisa membantu. Jika ada pertanyaan lain, silakan chat kami kapan saja.
                </p>
              </div>
            )}
            <div className="pd-review-actions">
              <button type="button" className="pd-review-like-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 1H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-6z" />
                  <path d="M14 1l-2 4-2-4" />
                </svg>
                <span>12</span>
              </button>
              <button type="button" className="pd-review-like-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15V3" />
                  <path d="M14 9l-4-4-4 4" />
                </svg>
                <span>2</span>
              </button>
            </div>
          </div>
        ))}
      </div>

            {/* FAQ */}
            <h2 className="pd-section-title">Pertanyaan Umum (FAQ)</h2>
            {faqs.map((f, i) => (
              <Accordion key={i} title={f.q}>
                <p>{f.a}</p>
              </Accordion>
            ))}

            {/* Produk Serupa */}
            {related.length > 0 && (
              <>
                <h2 className="pd-section-title">Produk Serupa</h2>
                <div className="pd-horizontal-scroll">
                  {related.map((p) => (
              <Link
                       key={p.id}
                       to={`/product/${p.id}`}
                       className="pd-horizontal-card"
                       onClick={() => goToProduct(p.id)}
                     >
                       <div className="pd-horizontal-img">
                         <ImageWithFallback src={p.image} alt={p.name} />
                       </div>
                       <div className="pd-horizontal-body">
                         <div className="pd-horizontal-name">{p.name}</div>
                         <div className="pd-horizontal-price">{p.price}</div>
                       </div>
                     </Link>
                  ))}
                </div>
              </>
            )}

            {/* Yang Mungkin Kamu Suka */}
            {youMayLike.length > 0 && (
              <>
                <h2 className="pd-section-title">Produk Yang Mungkin Kamu Suka</h2>
                <div className="pd-horizontal-scroll">
                  {youMayLike.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="pd-horizontal-card"
                      onClick={() => goToProduct(p.id)}
                    >
                      <div className="pd-horizontal-img">
                        <ImageWithFallback src={p.image} alt={p.name} />
                      </div>
                      <div className="pd-horizontal-body">
                        <div className="pd-horizontal-name">{p.name}</div>
                        <div className="pd-horizontal-price">{p.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ==================== KANAN (30%) ==================== */}
          <div className="pd-right">
            {/* Card Pembelian (sticky) */}
            <div className="pd-buy-card">
              <div className="pd-buy-name">{product.name}</div>

              <div className="pd-price-block">
                <span className="pd-price">{fmt(unitPrice)}</span>
                {product.nominals.length > 1 && (
                  <span className="pd-price-strike">{product.price}</span>
                )}
                {product.nominals.length > 1 && (
                  <span className="pd-discount-badge">HEMAT BANYAK</span>
                )}
              </div>

              {product.nominals.length > 1 && (
                <>
                  <label className="pd-field-label">Pilih Nominal</label>
                  <div className="pd-nominal-grid">
                    {product.nominals.map((n, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`pd-nominal ${idx === selectedNominal ? 'active' : ''}`}
                        onClick={() => setSelectedNominal(idx)}
                      >
                        <span className="pd-nominal-label">{n.label}</span>
                        <span className="pd-nominal-price">{fmt(n.price)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="pd-qty-row">
                <label className="pd-field-label" style={{ marginBottom: 0 }}>Jumlah</label>
                <div className="pd-qty-control">
                  <button
                    type="button"
                    className="pd-qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Kurangi"
                  >
                    −
                  </button>
                  <span className="pd-qty-value">{qty}</span>
                  <button
                    type="button"
                    className="pd-qty-btn"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    disabled={qty >= 99}
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pd-total-row">
                <span className="pd-total-label">Subtotal</span>
                <span className="pd-total-value">{fmt(total)}</span>
              </div>

              <div className="pd-actions">
                <button type="button" className="pd-btn-buy">
                  <IconBolt /> Beli Sekarang
                </button>
                <button type="button" className="pd-btn-cart">
                  <IconCart /> Tambah ke Keranjang
                </button>
                <button
                  type="button"
                  className={`pd-btn-secondary ${wishlisted ? 'active' : ''}`}
                  onClick={toggleWishlist}
                >
                  <IconHeart filled={wishlisted} /> Wishlist
                </button>
                <button type="button" className="pd-btn-secondary" onClick={handleShare}>
                  <IconShare /> Bagikan
                </button>
              </div>
            </div>

            {/* Chat Penjual (hanya seller pihak ketiga) */}
            {seller && (
              <div className="pd-chat-card">
                <div className="pd-chat-card-head">
                  <div className="pd-chat-card-avatar">
                    <ImageWithFallback src={seller.avatar} alt={seller.name} />
                  </div>
                  <div className="pd-chat-card-id">
                    <div className="pd-chat-card-top">
                      <div className="pd-chat-card-logo">
                        <ImageWithFallback src={assets.logo.icon.file} alt="Gameku" />
                      </div>
                      <span className="pd-chat-card-name">{seller.name}</span>
                    </div>
                    <StatusBadge status={seller.status} />
                  </div>
                </div>
                <div className="pd-chat-card-stats">
                  <div className="pd-chat-card-stat">
                    <span className="pd-cc-stat-value"><Stars value={parseFloat(seller.rating)} /> {seller.rating}</span>
                    <span className="pd-cc-stat-label">Rating</span>
                  </div>
                  <div className="pd-chat-card-stat">
                    <span className="pd-cc-stat-value">{seller.transactions}</span>
                    <span className="pd-cc-stat-label">Transaksi</span>
                  </div>
                  <div className="pd-chat-card-stat">
                    <span className="pd-cc-stat-value">{seller.response}</span>
                    <span className="pd-cc-stat-label">Response Time</span>
                  </div>
                </div>
                <div className="pd-chat-card-last">Terakhir aktif: {seller.lastActive}</div>
                <button type="button" className="pd-btn-chat-seller" onClick={() => setChat('seller')}>
                  <IconChat /> Chat Penjual
                </button>
              </div>
            )}

            {/* Butuh Bantuan? (Customer Service) */}
            <div className="pd-cs-card">
              <div className="pd-cs-card-head">
                <div className="pd-cs-card-logo">
                  <ImageWithFallback src={assets.logo.icon.file} alt="Gameku" />
                </div>
                <div className="pd-cs-card-id">
                  <div className="pd-cs-card-name">Customer Support</div>
                  <StatusBadge status="online" />
                </div>
              </div>
              <ul className="pd-cs-features">
                <li><IconHeadset /> Online 24 Jam</li>
                <li><IconBolt /> Response Cepat</li>
              </ul>
              <button type="button" className="pd-btn-chat-cs" onClick={() => setChat('cs')}>
                <IconHeadset /> Chat Customer Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating button (mobile) */}
      <div className="pd-floating">
        {seller && (
          <button type="button" className="pd-fab pd-fab-seller" onClick={() => setChat('seller')} aria-label="Chat Penjual">
            <IconChat />
          </button>
        )}
        <button type="button" className="pd-fab pd-fab-cs" onClick={() => setChat('cs')} aria-label="Chat Customer Service">
          <IconHeadset />
        </button>
      </div>

      {/* Panel Chat */}
      <ChatPanel open={chat === 'seller'} onClose={() => setChat(null)} peer={seller} variant="seller" />
      <ChatPanel open={chat === 'cs'} onClose={() => setChat(null)} peer={chatPeer} variant="cs" />
    </div>
  );
}

export default Product;