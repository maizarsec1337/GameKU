// DATABASE BELUM DIBUAT
// Semua data masih menggunakan array statis

const games = [
  { id: 1, name: 'Mobile Legends', slug: 'mlbb', image: '/images/game/mlbb.jpg', price: 'Rp15.000', category: 'topup' },
  { id: 2, name: 'Free Fire', slug: 'ff', image: '/images/game/ff.jpg', price: 'Rp10.000', category: 'topup' },
  { id: 3, name: 'PUBG Mobile', slug: 'pubg', image: '/images/game/pubg.jpg', price: 'Rp20.000', category: 'topup' },
  { id: 4, name: 'Genshin Impact', slug: 'genshin', image: '/images/game/genshin.jpg', price: 'Rp25.000', category: 'topup' },
  { id: 5, name: 'Valorant', slug: 'valorant', image: '/images/game/valorant.jpg', price: 'Rp30.000', category: 'topup' },
  { id: 6, name: 'FIFA Mobile', slug: 'fifa', image: '/images/game/fifa.jpg', price: 'Rp12.000', category: 'topup' },
  { id: 7, name: 'Call of Duty Mobile', slug: 'cod', image: '/images/game/cod.jpg', price: 'Rp18.000', category: 'topup' },
  { id: 8, name: 'League of Legends', slug: 'lol', image: '/images/game/lol.jpg', price: 'Rp22.000', category: 'topup' }
];

// TODO:
// Integrasi Midtrans nanti.

const getGames = (req, res) => {
  try {
    const { category } = req.query;
    let result = games;
    if (category) {
      result = games.filter(g => g.category === category);
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGameById = (req, res) => {
  try {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGameBySlug = (req, res) => {
  try {
    const game = games.find(g => g.slug === req.params.slug);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGames, getGameById, getGameBySlug };