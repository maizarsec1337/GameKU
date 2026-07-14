// DATABASE BELUM DIBUAT
// Semua data masih menggunakan array statis

const vouchers = [
  { id: 1, name: 'Google Play', slug: 'googleplay', image: '/images/voucher/googleplay.jpg', price: 'Rp20.000 - Rp500.000' },
  { id: 2, name: 'PlayStation', slug: 'playstation', image: '/images/voucher/playstation.jpg', price: 'Rp50.000 - Rp1.000.000' },
  { id: 3, name: 'Xbox', slug: 'xbox', image: '/images/voucher/xbox.jpg', price: 'Rp30.000 - Rp750.000' },
  { id: 4, name: 'Nintendo', slug: 'nintendo', image: '/images/voucher/nintendo.jpg', price: 'Rp25.000 - Rp600.000' }
];

// TODO:
// Integrasi Midtrans nanti.

const getVouchers = (req, res) => {
  try {
    res.json({ success: true, data: vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVoucherById = (req, res) => {
  try {
    const voucher = vouchers.find(v => v.id === parseInt(req.params.id));
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    res.json({ success: true, data: voucher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVouchers, getVoucherById };