// DATABASE BELUM DIBUAT
// Semua data masih menggunakan array statis

const promos = [
  { id: 1, title: 'Bonus Top Up 100%', description: 'Setiap pembelian pertama dapat bonus diamond hingga 100%', image: '/images/promo/bonus.jpg', link: '/promo', active: true },
  { id: 2, title: 'Diskon Member Baru', description: 'Dapatkan diskon 20% untuk pembelian pertama kamu', image: '/images/promo/flashsale.jpg', link: '/register', active: true },
  { id: 3, title: 'Flash Sale Akhir Pekan', description: 'Diskon hingga 70% setiap akhir pekan', image: '/images/promo/flashsale.jpg', link: '/promo', active: true },
  { id: 4, title: 'Cashback 10%', description: 'Dapatkan cashback 10% untuk setiap transaksi', image: '/images/promo/bonus.jpg', link: '/promo', active: true }
];

// TODO:
// Integrasi Midtrans nanti.

const getPromos = (req, res) => {
  try {
    res.json({ success: true, data: promos.filter(p => p.active) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPromos };