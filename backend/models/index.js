// Models index - export all models
const User = require('./User');
const Product = require('./Product');
const ProductCategory = require('./ProductCategory');
const ProductTag = require('./ProductTag');
const ProductImage = require('./ProductImage');
const Inventory = require('./Inventory');
const InventoryLog = require('./InventoryLog');
const SalesHistory = require('./SalesHistory');
const ProductView = require('./ProductView');
const Wishlist = require('./Wishlist');
const SearchIndex = require('./SearchIndex');
const SellerStatistics = require('./SellerStatistics');
const Order = require('./Order');
const Banner = require('./Banner');
const Promo = require('./Promo');
const Voucher = require('./Voucher');
const Reseller = require('./Reseller');

module.exports = {
  User,
  Product,
  ProductCategory,
  ProductTag,
  ProductImage,
  Inventory,
  InventoryLog,
  SalesHistory,
  ProductView,
  Wishlist,
  SearchIndex,
  SellerStatistics,
  Order,
  Banner,
  Promo,
  Voucher,
  Reseller
};