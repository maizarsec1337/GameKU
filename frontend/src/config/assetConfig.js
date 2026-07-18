const assets = {
  logo: {
    // Logo lengkap (ikon + tulisan GameKU) - untuk Navbar Desktop, Footer, Landing Page
    main: {
      file: '/gambar/logo/logo.png',
      title: 'Gameku',
      alt: 'Gameku Logo',
      category: 'logo',
      width: 160,
      height: 40
    },
    // Logo ikon portrait (Glogo.png) - untuk Login, Register, Forgot Password, Reset Password, Loading Screen, Favicon
    icon: {
      file: '/gambar/logo/Glogo.png',
      title: 'Gameku Icon',
      alt: 'Gameku Icon',
      category: 'logo',
      width: 32,
      height: 32
    },
    // Logo ikon landscape (Glogo2.png) - untuk Sidebar Dashboard, Header Dashboard
    iconLandscape: {
      file: '/gambar/logo/Glogo2.png',
      title: 'Gameku Icon Landscape',
      alt: 'Gameku Icon Landscape',
      category: 'logo',
      width: 80,
      height: 32
    }
  },
  
  // Fallback images for all types
  fallback: {
    product: {
      file: '/gambar/logo/Gcard.png',
      title: 'Product Fallback',
      alt: 'Default Product Image',
      category: 'fallback',
      width: 200,
      height: 200
    },
    banner: {
      file: '/gambar/banner/hero1.png',
      title: 'Banner Fallback',
      alt: 'Default Banner Image',
      category: 'fallback',
      width: 1200,
      height: 500
    },
    avatar: {
      file: '/gambar/avatar/default.png',
      title: 'Avatar Fallback',
      alt: 'Default Avatar',
      category: 'fallback',
      width: 80,
      height: 80
    },
    promo: {
      file: '/gambar/promo/flashsale.png',
      title: 'Promo Fallback',
      alt: 'Default Promo Image',
      category: 'fallback',
      width: 400,
      height: 200
    },
    review: {
      file: '/gambar/logo/Gcard.png',
      title: 'Review Fallback',
      alt: 'Default Review Image',
      category: 'fallback',
      width: 200,
      height: 200
    },
    voucher: {
      file: '/gambar/voucher/googleplay.png',
      title: 'Voucher Fallback',
      alt: 'Default Voucher Image',
      category: 'fallback',
      width: 200,
      height: 200
    }
  },
  
  banner: {
    hero1: {
      file: '/gambar/banner/hero1.png',
      title: 'Top Up Game Murah',
      alt: 'Banner Top Up Game Murah',
      category: 'banner',
      description: 'Top up game favoritmu dengan harga termurah',
      width: 1200,
      height: 500
    },
    hero2: {
      file: '/gambar/banner/hero2.png',
      title: 'Voucher Game Diskon',
      alt: 'Banner Voucher Game Diskon',
      category: 'banner',
      description: 'Dapatkan voucher game diskon hingga 50%',
      width: 1200,
      height: 500
    },
    hero3: {
      file: '/gambar/banner/hero3.png',
      title: 'Steam Wallet Promo',
      alt: 'Banner Steam Wallet Promo',
      category: 'banner',
      description: 'Isi Steam Wallet dengan harga spesial',
      width: 1200,
      height: 500
    },
    promo1: {
      file: '/gambar/banner/promo1.png',
      title: 'Promo Akhir Tahun',
      alt: 'Banner Promo Akhir Tahun',
      category: 'banner',
      description: 'Promo akhir tahun spesial untuk kamu',
      width: 600,
      height: 300
    },
    promo2: {
      file: '/gambar/banner/promo2.png',
      title: 'Promo Member Baru',
      alt: 'Banner Promo Member Baru',
      category: 'banner',
      description: 'Diskon 20% untuk member baru',
      width: 600,
      height: 300
    }
  },
  
  game: {
    mlbb: {
      file: '/gambar/game/mlbb.png',
      title: 'Mobile Legends',
      alt: 'Mobile Legends Bang Bang',
      category: 'game',
      description: 'Top Up Mobile Legends',
      width: 200,
      height: 200
    },
    ff: {
      file: '/gambar/game/free-fire.png',
      title: 'Free Fire',
      alt: 'Free Fire',
      category: 'game',
      description: 'Top Up Free Fire',
      width: 200,
      height: 200
    },
    pubg: {
      file: '/gambar/game/pubg.webp',
      title: 'PUBG Mobile',
      alt: 'PUBG Mobile',
      category: 'game',
      description: 'Top Up PUBG Mobile',
      width: 200,
      height: 200
    },
    genshin: {
      file: '/gambar/game/genshin.jpeg',
      title: 'Genshin Impact',
      alt: 'Genshin Impact',
      category: 'game',
      description: 'Top Up Genshin Impact',
      width: 200,
      height: 200
    },
    valorant: {
      file: '/gambar/game/valorant.png',
      title: 'Valorant',
      alt: 'Valorant',
      category: 'game',
      description: 'Top Up Valorant',
      width: 200,
      height: 200
    },
    fifa: {
      file: '/gambar/game/efootbal.webp',
      title: 'FIFA Mobile',
      alt: 'FIFA Mobile',
      category: 'game',
      description: 'Top Up FIFA Mobile',
      width: 200,
      height: 200
    },
    cod: {
      file: '/gambar/game/codm.jpeg',
      title: 'Call of Duty Mobile',
      alt: 'Call of Duty Mobile',
      category: 'game',
      description: 'Top Up Call of Duty Mobile',
      width: 200,
      height: 200
    },
    lol: {
      file: '/gambar/game/lol.jpeg',
      title: 'League of Legends',
      alt: 'League of Legends Wild Rift',
      category: 'game',
      description: 'Top Up League of Legends',
      width: 200,
      height: 200
    },
    playstation: {
      file: '/gambar/game/playstation.jpeg',
      title: 'PlayStation',
      alt: 'PlayStation Network',
      category: 'game',
      description: 'PlayStation Store',
      width: 200,
      height: 200
    },
    xbox: {
      file: '/gambar/game/xbox.png',
      title: 'Xbox',
      alt: 'Xbox Live',
      category: 'game',
      description: 'Xbox Gift Card',
      width: 200,
      height: 200
    }
  },
  
  voucher: {
    googleplay: {
      file: '/gambar/voucher/googleplay.png',
      title: 'Google Play',
      alt: 'Google Play Gift Card',
      category: 'voucher',
      description: 'Google Play Gift Card',
      width: 200,
      height: 200
    },
    playstation: {
      file: '/gambar/voucher/playstation.png',
      title: 'PlayStation',
      alt: 'PlayStation Store Gift Card',
      category: 'voucher',
      description: 'PlayStation Store Gift Card',
      width: 200,
      height: 200
    },
    xbox: {
      file: '/gambar/voucher/xbox.png',
      title: 'Xbox',
      alt: 'Xbox Gift Card',
      category: 'voucher',
      description: 'Xbox Gift Card',
      width: 200,
      height: 200
    },
    nintendo: {
      file: '/gambar/voucher/nintendo.png',
      title: 'Nintendo',
      alt: 'Nintendo eShop Gift Card',
      category: 'voucher',
      description: 'Nintendo eShop Gift Card',
      width: 200,
      height: 200
    }
  },
  
  steam: {
    wallet: {
      file: '/gambar/steam/steam.jpeg',
      title: 'Steam Wallet',
      alt: 'Steam Wallet',
      category: 'steam',
      description: 'Isi Steam Wallet',
      width: 200,
      height: 200
    },
    giftcard: {
      file: '/gambar/giftcard/youtube.png',
      title: 'Steam Gift Card',
      alt: 'Steam Gift Card',
      category: 'steam',
      description: 'Steam Gift Card',
      width: 200,
      height: 200
    }
  },
  
  giftcard: {
    itunes: {
      file: '/gambar/giftcard/itunes.png',
      title: 'Apple iTunes',
      alt: 'Apple iTunes Gift Card',
      category: 'giftcard',
      description: 'Apple iTunes Gift Card',
      width: 200,
      height: 200
    },
    spotify: {
      file: '/gambar/giftcard/spotify.png',
      title: 'Spotify Premium',
      alt: 'Spotify Premium Gift Card',
      category: 'giftcard',
      description: 'Spotify Premium Gift Card',
      width: 200,
      height: 200
    },
    netflix: {
      file: '/gambar/giftcard/netflix.png',
      title: 'Netflix',
      alt: 'Netflix Gift Card',
      category: 'giftcard',
      description: 'Netflix Gift Card',
      width: 200,
      height: 200
    },
    youtube: {
      file: '/gambar/giftcard/youtube.png',
      title: 'YouTube Premium',
      alt: 'YouTube Premium Gift Card',
      category: 'giftcard',
      description: 'YouTube Premium Gift Card',
      width: 200,
      height: 200
    }
  },
  
  promo: {
    flashsale: {
      file: '/gambar/promo/flashsale.png',
      title: 'Flash Sale',
      alt: 'Flash Sale Gameku',
      category: 'promo',
      description: 'Flash sale setiap hari',
      width: 400,
      height: 200
    },
    bonus: {
      file: '/gambar/promo/bonus.png',
      title: 'Bonus Top Up',
      alt: 'Bonus Top Up Gameku',
      category: 'promo',
      description: 'Bonus top up hingga 100%',
      width: 400,
      height: 200
    }
  },
  
  icon: {
    cart: {
      file: '/gambar/icon/cart.png',
      title: 'Cart',
      alt: 'Cart Icon',
      category: 'icon',
      width: 24,
      height: 24
    },
    search: {
      file: '/gambar/icon/search.png',
      title: 'Search',
      alt: 'Search Icon',
      category: 'icon',
      width: 24,
      height: 24
    },
    user: {
      file: '/gambar/icon/user.png',
      title: 'User',
      alt: 'User Icon',
      category: 'icon',
      width: 24,
      height: 24
    },
    discount: {
      file: '/gambar/icon/discount.png',
      title: 'Discount',
      alt: 'Discount Icon',
      category: 'icon',
      width: 24,
      height: 24
    },
    shield: {
      file: '/gambar/icon/shield.png',
      title: 'Shield',
      alt: 'Shield Icon',
      category: 'icon',
      width: 24,
      height: 24
    },
    delivery: {
      file: '/gambar/icon/delivery.png',
      title: 'Delivery',
      alt: 'Delivery Icon',
      category: 'icon',
      width: 24,
      height: 24
    },
    support: {
      file: '/gambar/icon/support.png',
      title: 'Support',
      alt: 'Support Icon',
      category: 'icon',
      width: 24,
      height: 24
    }
  },
  
  // Website background for auth pages
  background: {
    website: {
      file: '/gambar/background/Gbackgound.png',
      title: 'Website Background',
      alt: 'GameKU Website Background',
      category: 'background',
      width: 1920,
      height: 1080
    },
    hero: {
      file: '/gambar/background/hero-bg.png',
      title: 'Hero Background',
      alt: 'Hero Section Background',
      category: 'background',
      width: 1920,
      height: 600
    },
    features: {
      file: '/gambar/background/features-bg.png',
      title: 'Features Background',
      alt: 'Features Section Background',
      category: 'background',
      width: 1920,
      height: 400
    }
  },
  
  avatar: {
    default: {
      file: '/gambar/avatar/default.png',
      title: 'Default Avatar',
      alt: 'Default User Avatar',
      category: 'avatar',
      width: 80,
      height: 80
    }
  }
};
  
export default assets;