import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ResellerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/reseller', label: 'Dashboard', icon: '📊' },
    { path: '/reseller/store', label: 'Kelola Toko', icon: '🏪' },
    { path: '/reseller/products', label: 'Kelola Produk', icon: '📦' },
    { path: '/reseller/orders', label: 'Kelola Pesanan', icon: '🛒' },
    { path: '/reseller/stock', label: 'Kelola Stok', icon: '📊' },
    { path: '/reseller/saldo', label: 'Saldo Internal', icon: '💰' },
    { path: '/reseller/statistik', label: 'Statistik', icon: '📈' },
    { path: '/reseller/withdraw', label: 'Withdraw', icon: '💸' },
  ];

  return (
    <div className="reseller-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>GameKU Reseller</h2>
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

export default ResellerLayout;