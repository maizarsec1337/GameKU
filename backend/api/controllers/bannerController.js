// DATABASE BELUM DIBUAT
// Semua data masih menggunakan array statis

const banners = [
  { id: 1, title: 'Top Up Game Murah', description: 'Top up game favoritmu dengan harga termurah', image: '/images/banner/hero1.jpg', link: '/category/topup', active: true },
  { id: 2, title: 'Voucher Game Diskon', description: 'Dapatkan voucher game diskon hingga 50%', image: '/images/banner/hero2.jpg', link: '/category/voucher', active: true },
  { id: 3, title: 'Steam Wallet Promo', description: 'Isi Steam Wallet dengan harga spesial', image: '/images/banner/hero3.jpg', link: '/category/steam', active: true }
];

const getBanners = (req, res) => {
  try {
    res.json({
      success: true,
      data: banners.filter(b => b.active)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBannerById = (req, res) => {
  try {
    const banner = banners.find(b => b.id === parseInt(req.params.id));
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
    }
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBanners, getBannerById };