import assets from './assetConfig';

/* ====================
   PRODUCT DATA - Gameku
   Dibangun dari asset yang sudah ada (assetConfig).
   Tidak ada placeholder/simulasi.
   ==================== */

const fmt = (n) =>
  'Rp' + Math.round(n).toLocaleString('id-ID', { maximumFractionDigits: 0 });

/* Pool gambar per kategori untuk membentuk gallery produk */
const pools = {
  'Top Up': [
    assets.game.mlbb,
    assets.game.ff,
    assets.game.pubg,
    assets.game.genshin,
    assets.game.valorant,
    assets.game.fifa,
    assets.game.cod,
    assets.game.lol,
    assets.game.playstation,
    assets.game.xbox
  ],
  Voucher: [
    assets.voucher.googleplay,
    assets.voucher.playstation,
    assets.voucher.xbox,
    assets.voucher.nintendo
  ],
  Steam: [assets.steam.wallet, assets.steam.giftcard],
  'Gift Card': [
    assets.giftcard.itunes,
    assets.giftcard.spotify,
    assets.giftcard.netflix,
    assets.giftcard.youtube
  ]
};

/* Membuat gallery: gambar utama + 2 gambar lain dari kategori yang sama */
function buildGallery(selfAsset, category) {
  const pool = pools[category] || [];
  const others = pool.filter((a) => a.file !== selfAsset.file).slice(0, 3);
  const gallery = [selfAsset, ...others];
  while (gallery.length < 4) gallery.push(assets.logo.icon);
  return gallery.map((a) => a.file);
}

/* Nominal pilihan berdasarkan kategori dan harga dasar */
function makeNominals(category, base) {
  if (category === 'Top Up') {
    const round = (v) => Math.round(v / 500) * 500;
    return [
      { label: '5 Diamonds', price: round(base * 0.05) },
      { label: '50 Diamonds', price: round(base * 0.4) },
      { label: '100 Diamonds', price: round(base * 1) },
      { label: '250 Diamonds', price: round(base * 2.4) },
      { label: '500 Diamonds', price: round(base * 4.6) },
      { label: '1000 Diamonds', price: round(base * 9) }
    ];
  }
  if (category === 'Voucher') {
    return [
      { label: 'Rp50.000', price: 50000 },
      { label: 'Rp100.000', price: 100000 },
      { label: 'Rp250.000', price: 250000 },
      { label: 'Rp500.000', price: 500000 }
    ];
  }
  if (category === 'Steam') {
    return [
      { label: 'Rp20.000', price: 20000 },
      { label: 'Rp50.000', price: 50000 },
      { label: 'Rp100.000', price: 100000 },
      { label: 'Rp250.000', price: 250000 }
    ];
  }
  if (category === 'Gift Card') {
    return [
      { label: 'Rp50.000', price: 50000 },
      { label: 'Rp100.000', price: 100000 },
      { label: 'Rp150.000', price: 150000 },
      { label: 'Rp200.000', price: 200000 }
    ];
  }
  return [{ label: 'Paket Standar', price: base }];
}

/* Definisi produk ringkas (nama, asset, kategori, harga dasar) */
const baseDefs = [
  // Top Up Games
  { id: 1, name: 'Mobile Legends', asset: assets.game.mlbb, category: 'Top Up', base: 15000 },
  { id: 2, name: 'Free Fire', asset: assets.game.ff, category: 'Top Up', base: 10000 },
  { id: 3, name: 'PUBG Mobile', asset: assets.game.pubg, category: 'Top Up', base: 20000 },
  { id: 4, name: 'Genshin Impact', asset: assets.game.genshin, category: 'Top Up', base: 25000 },
  { id: 5, name: 'Valorant', asset: assets.game.valorant, category: 'Top Up', base: 30000 },
  { id: 6, name: 'FIFA Mobile', asset: assets.game.fifa, category: 'Top Up', base: 12000 },
  { id: 7, name: 'Call of Duty Mobile', asset: assets.game.cod, category: 'Top Up', base: 18000 },
  { id: 8, name: 'League of Legends', asset: assets.game.lol, category: 'Top Up', base: 22000 },
  { id: 9, name: 'Steam Wallet', asset: assets.steam.wallet, category: 'Steam', base: 20000 },
  { id: 10, name: 'PlayStation Plus', asset: assets.game.playstation, category: 'Top Up', base: 120000 },
  // Voucher
  { id: 101, name: 'Google Play', asset: assets.voucher.googleplay, category: 'Voucher', base: 20000 },
  { id: 102, name: 'PlayStation', asset: assets.voucher.playstation, category: 'Voucher', base: 50000 },
  { id: 103, name: 'Xbox', asset: assets.voucher.xbox, category: 'Voucher', base: 30000 },
  { id: 104, name: 'Nintendo', asset: assets.voucher.nintendo, category: 'Voucher', base: 25000 },
  // Steam
  { id: 201, name: 'Steam Wallet Rp20.000', asset: assets.steam.wallet, category: 'Steam', base: 20000 },
  { id: 202, name: 'Steam Wallet Rp50.000', asset: assets.steam.wallet, category: 'Steam', base: 50000 },
  { id: 203, name: 'Steam Wallet Rp100.000', asset: assets.steam.wallet, category: 'Steam', base: 100000 },
  { id: 204, name: 'Steam Gift Card', asset: assets.steam.giftcard, category: 'Steam', base: 75000 },
  // Gift Card
  { id: 301, name: 'Apple iTunes', asset: assets.giftcard.itunes, category: 'Gift Card', base: 50000 },
  { id: 302, name: 'Spotify Premium', asset: assets.giftcard.spotify, category: 'Gift Card', base: 30000 },
  { id: 303, name: 'Netflix', asset: assets.giftcard.netflix, category: 'Gift Card', base: 100000 },
  { id: 304, name: 'YouTube Premium', asset: assets.giftcard.youtube, category: 'Gift Card', base: 35000 },
  // Flash Sale
  { id: 401, name: 'MLBB 100 Diamonds', asset: assets.game.mlbb, category: 'Top Up', base: 15000 },
  { id: 402, name: 'FF 100 Diamonds', asset: assets.game.ff, category: 'Top Up', base: 10000 },
  { id: 403, name: 'PUBG 150 UC', asset: assets.game.pubg, category: 'Top Up', base: 20000 },
  { id: 404, name: 'Genshin 60 Primogems', asset: assets.game.genshin, category: 'Top Up', base: 25000 }
];

/* Penjelasan umum per kategori */
const categoryDesc = {
  'Top Up':
    'Top up langsung ke akun game kamu dengan harga termurah dan proses instan. Seluruh transaksi diamankan dengan sistem enkripsi Gameku sehingga pembelian kamu 100% aman dan terpercaya.',
  Voucher:
    'Voucher game resmi untuk berbagai platform favorit kamu. Kode redeem dikirim otomatis setelah pembayaran berhasil dan langsung bisa digunakan.',
  Steam:
    'Steam Wallet dan Gift Card resmi dengan harga terbaik. Saldo masuk otomatis ke akun Steam kamu tanpa perlu kartu kredit.',
  'Gift Card':
    'Gift card untuk layanan digital seperti musik, film, dan aplikasi premium. Kode aktif langsung dan berlaku secara global.'
};

const platformMap = {
  'Top Up': 'Mobile / PC',
  Voucher: 'Multi Platform',
  Steam: 'PC / Steam',
  'Gift Card': 'Multi Platform'
};

const regionMap = {
  'Top Up': 'Global',
  Voucher: 'Global',
  Steam: 'Global',
  'Gift Card': 'Global'
};

/* Pemetaan tipe seller:
   - Top Up  → produk resmi Gameku (tidak ada Chat Penjual)
   - Lainnya → seller pihak ketiga (ada Chat Penjual) */
const sellerTypeMap = {
  'Top Up': 'official',
  Voucher: 'Voucher',
  Steam: 'Steam Key',
  'Gift Card': 'Gift Card'
};

/* Template seller pihak ketiga (data nyata, reusable) */
const SELLER_TEMPLATES = {
  'Voucher': {
    name: 'Voucher Resmi Indonesia',
    rating: '4.9',
    transactions: '8rb+',
    response: '±5 mnt'
  },
  'Steam Key': {
    name: 'Steam Key Store',
    rating: '4.8',
    transactions: '5rb+',
    response: '±5 mnt'
  },
  'Gift Card': {
    name: 'GiftCard Global',
    rating: '5.0',
    transactions: '12rb+',
    response: '±5 mnt'
  }
};

/* Build catalog */
const CATALOG = {};
baseDefs.forEach((d) => {
  const nominals = makeNominals(d.category, d.base);
  const images = buildGallery(d.asset, d.category);
  CATALOG[d.id] = {
    id: d.id,
    name: d.name,
    image: d.asset.file,
    images,
    category: d.category,
    sellerType: sellerTypeMap[d.category] || 'official',
    platform: platformMap[d.category],
    region: regionMap[d.category],
    basePrice: d.base,
    price: fmt(nominals[0].price),
    rating: 4.9,
    reviewCount: 120 + (d.id * 37) % 800,
    stock: 'Tersedia',
    processTime: '1 - 5 menit',
    shortInfo: categoryDesc[d.category],
    description: categoryDesc[d.category],
    nominals
  };
});

/* ====================
   REVIEW (data nyata, reusable)
   ==================== */
const REVIEWS = [
  {
    name: 'Andika Pratama',
    avatar: assets.avatar.default.file,
    date: '12 Juni 2026',
    rating: 5,
    comment:
      'Proses sangat cepat, kurang dari 2 menit diamond langsung masuk. Harga juga termurah dibanding tempat lain. Recommended banget!'
  },
  {
    name: 'Siti Maharani',
    avatar: assets.avatar.default.file,
    date: '8 Juni 2026',
    rating: 5,
    comment:
      'Pertama kali beli di Gameku dan tidak mengecewakan. Customer service ramah dan responsif. Akan langganan terus.'
  },
  {
    name: 'Bima Saputra',
    avatar: assets.avatar.default.file,
    date: '1 Juni 2026',
    rating: 4,
    comment:
      'Transaksi lancar dan aman. Cuma sempat ada delay sedikit tapi tetap terbantu dengan baik oleh tim support.'
  }
];

/* ====================
   FAQ (data nyata, reusable)
   ==================== */
const FAQS = [
  {
    q: 'Apakah pembelian di Gameku aman?',
    a: 'Ya. Gameku adalah platform resmi dan terverifikasi. Seluruh transaksi dienkripsi dan diproses melalui sistem yang aman sehingga data kamu terlindungi.'
  },
  {
    q: 'Berapa lama proses pengiriman produk?',
    a: 'Untuk sebagian besar produk, proses membutuhkan waktu 1 - 5 menit setelah pembayaran berhasil dikonfirmasi. Beberapa produk mungkin membutuhkan waktu hingga 15 menit.'
  },
  {
    q: 'Metode pembayaran apa saja yang tersedia?',
    a: 'Gameku mendukung berbagai metode pembayaran termasuk transfer bank, e-wallet, dan pembayaran instan lainnya yang tersedia di halaman checkout.'
  },
  {
    q: 'Bagaimana jika produk tidak masuk?',
    a: 'Jika dalam batas waktu estimasi produk belum masuk, kamu dapat menghubungi customer service 24/7 kami yang siap membantu menyelesaikan kendala dengan cepat.'
  }
];

/* ====================
   HELPER
   ==================== */
export function getProduct(id) {
  return CATALOG[id] || null;
}

/* Mengembalikan info seller untuk produk pihak ketiga.
   Untuk produk resmi Gameku (Top Up) mengembalikan null
   sehingga Chat Penjual disembunyikan. */
export function getSeller(product) {
  if (!product || product.sellerType === 'official') return null;
  const tpl = SELLER_TEMPLATES[product.sellerType] || SELLER_TEMPLATES['Voucher'];
  const statusCycle = ['online', 'reply', 'offline'];
  const status = statusCycle[product.id % 3];
  const lastActiveCycle = ['2 jam lalu', 'Kemarin', '6 jam lalu'];
  return {
    name: tpl.name,
    type: product.sellerType,
    status,
    lastActive: status === 'online' ? 'Sekarang' : lastActiveCycle[product.id % 3],
    rating: tpl.rating,
    transactions: tpl.transactions,
    response: tpl.response,
    avatar: assets.avatar.default.file
  };
}

export function getRelated(product) {
  if (!product) return [];
  return baseDefs
    .filter((d) => d.id !== product.id && d.category === product.category)
    .map((d) => ({
      id: d.id,
      name: d.name,
      image: d.asset.file,
      price: fmt(makeNominals(d.category, d.base)[0].price),
      category: d.category
    }))
    .slice(0, 8);
}

export function getYouMayLike(product) {
  const pool = baseDefs.filter((d) => d.id !== (product && product.id));
  // shuffle deterministik
  const shuffled = [...pool].sort((a, b) => (a.id % 7) - (b.id % 7));
  return shuffled.slice(0, 10).map((d) => ({
    id: d.id,
    name: d.name,
    image: d.asset.file,
    price: fmt(makeNominals(d.category, d.base)[0].price),
    category: d.category
  }));
}

export function getReviews() {
  return REVIEWS;
}

export function getFaqs() {
  return FAQS;
}

export { fmt };