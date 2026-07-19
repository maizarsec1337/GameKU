import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

const menuItems = [
  { path: '/user', label: 'Dashboard', icon: '📊' },
  { path: '/user/profile', label: 'Profil', icon: '👤' },
  { path: '/user/edit-profile', label: 'Edit Profil', icon: '✏️' },
  { path: '/user/wishlist', label: 'Wishlist', icon: '❤️' },
  { path: '/user/orders', label: 'Riwayat Order', icon: '🛒' },
  { path: '/user/settings', label: 'Pengaturan', icon: '⚙️' },
  { path: '/user/become-reseller', label: 'Daftar Menjadi Reseller', icon: '🏪' },
];

  return (
    <div className="user-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>GameKU User</h2>
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

export default UserLayout;