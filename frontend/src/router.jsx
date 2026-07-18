import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Product from './pages/Product';
import Category from './pages/Category';
import Search from './pages/Search';
import Promo from './pages/Promo';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminResellers from './pages/admin/Resellers';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminBanners from './pages/admin/Banners';
import AdminCategories from './pages/admin/Categories';
import AdminGames from './pages/admin/Games';
import AdminVouchers from './pages/admin/Vouchers';
import AdminPromos from './pages/admin/Promos';
import AdminWithdraws from './pages/admin/Withdraws';
import ResellerLayout from './pages/reseller/ResellerLayout';
import ResellerDashboard from './pages/reseller/Dashboard';
import ResellerStore from './pages/reseller/Store';
import ResellerProducts from './pages/reseller/Products';
import ResellerOrders from './pages/reseller/Orders';
import ResellerStock from './pages/reseller/Stock';
import ResellerSaldo from './pages/reseller/Saldo';
import ResellerStatistik from './pages/reseller/Statistik';
import ResellerWithdraw from './pages/reseller/Withdraw';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import UserOrders from './pages/user/Orders';
import UserWishlist from './pages/user/Wishlist';
import UserAddresses from './pages/user/Addresses';
import UserVouchers from './pages/user/Vouchers';
import UserPaymentMethods from './pages/user/PaymentMethods';
import UserNotifications from './pages/user/Notifications';
import UserSettings from './pages/user/Settings';
import {
  AdminRoute,
  ResellerRoute,
  UserRoute
} from './components/RouteProtection';

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/search" element={<Search />} />
      <Route path="/promo" element={<Promo />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="resellers" element={<AdminResellers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="games" element={<AdminGames />} />
        <Route path="vouchers" element={<AdminVouchers />} />
        <Route path="promos" element={<AdminPromos />} />
        <Route path="withdraws" element={<AdminWithdraws />} />
      </Route>
      
      {/* User Routes */}
      <Route path="/user" element={<UserRoute><UserLayout /></UserRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="wishlist" element={<UserWishlist />} />
        <Route path="addresses" element={<UserAddresses />} />
        <Route path="vouchers" element={<UserVouchers />} />
        <Route path="payment-methods" element={<UserPaymentMethods />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>

      {/* Reseller Routes */}
      <Route path="/reseller" element={<ResellerRoute><ResellerLayout /></ResellerRoute>}>
        <Route index element={<ResellerDashboard />} />
        <Route path="store" element={<ResellerStore />} />
        <Route path="products" element={<ResellerProducts />} />
        <Route path="orders" element={<ResellerOrders />} />
        <Route path="stock" element={<ResellerStock />} />
        <Route path="saldo" element={<ResellerSaldo />} />
        <Route path="statistik" element={<ResellerStatistik />} />
        <Route path="withdraw" element={<ResellerWithdraw />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
