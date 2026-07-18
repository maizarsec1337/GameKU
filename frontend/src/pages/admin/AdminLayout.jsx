import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Kelola User', icon: '👤' },
    { path: '/admin/resellers', label: 'Kelola Reseller', icon: '🏪' },
    { path: '/admin/products', label: 'Kelola Produk', icon: '📦' },
    { path: '/admin/orders', label: 'Kelola Pesanan', icon: '🛒' },
    { path: '/admin/banners', label: 'Kelola Banner', icon: '🏷️' },
    { path: '/admin/categories', label: 'Kelola Kategori', icon: '📂' },
    { path: '/admin/games', label: 'Kelola Game', icon: '🎮' },
    { path: '/admin/vouchers', label: 'Kelola Voucher', icon: '🎟️' },
    { path: '/admin/promos', label: 'Kelola Promo', icon: '🏷️' },
    { path: '/admin/withdraws', label: 'Kelola Withdraw', icon: '💰' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>GameKU Admin</h2>
          <button onClick={() => setCollapsed(!collapsed)} className="sidebar-toggle">
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="admin-nav">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              end
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-user">
            Halo, {user?.fullName || user?.email}
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;