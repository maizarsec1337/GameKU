// DATABASE BELUM DIBUAT
// Semua data masih menggunakan array statis

const categories = [
  { id: 1, name: 'Top Up Game', slug: 'topup', icon: '🎮', count: '100+ Game' },
  { id: 2, name: 'Voucher Game', slug: 'voucher', icon: '🎟️', count: '50+ Voucher' },
  { id: 3, name: 'Steam Wallet', slug: 'steam', icon: '🪙', count: '10+ Produk' },
  { id: 4, name: 'Gift Card', slug: 'giftcard', icon: '🎁', count: '20+ Pilihan' },
  { id: 5, name: 'Membership', slug: 'membership', icon: '⭐', count: '2 Paket' },
  { id: 6, name: 'Google Play', slug: 'googleplay', icon: '▶️', count: '5+ Nominal' },
  { id: 7, name: 'PlayStation', slug: 'playstation', icon: '🎮', count: '10+ Voucher' },
  { id: 8, name: 'Entertainment', slug: 'entertainment', icon: '🎬', count: '15+ Produk' }
];

const getCategories = (req, res) => {
  try {
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryBySlug = (req, res) => {
  try {
    const category = categories.find(c => c.slug === req.params.slug);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, getCategoryBySlug };