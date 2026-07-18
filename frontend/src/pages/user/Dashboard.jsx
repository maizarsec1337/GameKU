import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/authAPI';

function UserDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    wishlistCount: 0,
    vouchersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [ordersRes] = await Promise.all([
        api.get('/user/orders').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      const orders = ordersRes.data?.data || [];
      const pending = orders.filter(o => o.status === 'pending' || o.status === 'menunggu');
      const completed = orders.filter(o => o.status === 'selesai' || o.status === 'completed');

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending.length,
        completedOrders: completed.length,
        wishlistCount: 0,
        vouchersCount: 0
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat dashboard...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard Saya</h1>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pesanan</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Menunggu Proses</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Selesai</h3>
            <p className="stat-value">{stats.completedOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>Wishlist</h3>
            <p className="stat-value">{stats.wishlistCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Pesanan Terakhir</h2>
          <Link to="/user/orders" className="admin-link">Lihat Semua</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="admin-empty">
            <p>Belum ada pesanan</p>
            <Link to="/" className="admin-btn admin-btn-primary">Belanja Sekarang</Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.created_at || order.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>Rp {(order.total || order.amount)?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/user/orders/${order.id}`} className="admin-btn admin-btn-sm">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;