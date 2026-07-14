// DATABASE BELUM DIBUAT
// Semua data masih menggunakan array statis

const searchData = [
  { id: 1, name: 'Mobile Legends', slug: 'mlbb', image: '/images/game/mlbb.jpg', price: 'Rp15.000', type: 'game', category: 'topup' },
  { id: 2, name: 'Free Fire', slug: 'ff', image: '/images/game/ff.jpg', price: 'Rp10.000', type: 'game', category: 'topup' },
  { id: 3, name: 'PUBG Mobile', slug: 'pubg', image: '/images/game/pubg.jpg', price: 'Rp20.000', type: 'game', category: 'topup' },
  { id: 4, name: 'Genshin Impact', slug: 'genshin', image: '/images/game/genshin.jpg', price: 'Rp25.000', type: 'game', category: 'topup' },
  { id: 5, name: 'Valorant', slug: 'valorant', image: '/images/game/valorant.jpg', price: 'Rp30.000', type: 'game', category: 'topup' },
  { id: 6, name: 'Google Play', slug: 'googleplay', image: '/images/voucher/googleplay.jpg', price: 'Rp20.000 - Rp500.000', type: 'voucher', category: 'voucher' },
  { id: 7, name: 'PlayStation', slug: 'playstation', image: '/images/voucher/playstation.jpg', price: 'Rp50.000 - Rp1.000.000', type: 'voucher', category: 'voucher' },
  { id: 8, name: 'Steam Wallet', slug: 'steam', image: '/images/steam/steamwallet.jpg', price: 'Rp20.000', type: 'steam', category: 'steam' }
];

const search = (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.json({ success: true, data: searchData, total: searchData.length });
    }

    const query = q.toLowerCase();
    let results = searchData.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    if (type) {
      results = results.filter(item => item.type === type);
    }

    res.json({ success: true, data: results, total: results.length, query: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchSuggestions = (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const query = q.toLowerCase();
    const suggestions = searchData
      .filter(item => item.name.toLowerCase().includes(query))
      .slice(0, 5)
      .map(item => ({ name: item.name, slug: item.slug }));

    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { search, searchSuggestions };