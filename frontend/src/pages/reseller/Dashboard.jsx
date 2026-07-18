import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/authAPI';

function ResellerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    balance: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        api.get('/reseller/products').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/reseller/orders').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/reseller/dashboard/stats').catch(() => ({ data: { success: false, data: {} } }))
      ]);

      const products = productsRes.data?.data || [];
      const orders = ordersRes.data?.data || [];
      const statsData = statsRes.data?.data || {};

      const pending = orders.filter(o => o.status === 'pending' || o.status === 'menunggu');
      const completed = orders.filter(o => o.status === 'selesai' || o.status === 'completed');
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || o.amount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: pending.length,
        completedOrders: completed.length,
        balance: statsData.balance || 0
      });

      setRecentOrders(orders.slice(0, 5));
      setTopProducts(products.slice(0, 5));
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
      <h1 className="admin-page-title">Dashboard Reseller</h1>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Saldo Internal</h3>
            <p className="stat-value">Rp {stats?.balance?.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Produk</h3>
            <p className="stat-value">{stats?.totalProducts || 0}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pesanan</h3>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>Total Pendapatan</h3>
            <p className="stat-value">Rp {(stats?.totalRevenue || 0)?.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pesanan Pending</h3>
            <p className="stat-value">{stats?.pendingOrders || 0}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Pesanan Selesai</h3>
            <p className="stat-value">{stats?.completedOrders || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="admin-card-header">
          <h2>Pesanan Terbaru</h2>
          <Link to="/reseller/orders" className="admin-link">Lihat Semua</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">
            <p>Belum ada pesanan masuk</p>
            <Link to="/reseller/products" className="admin-btn admin-btn-primary">Kelola Produk</Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produk</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.product_name || `Produk #${order.product_id}`}</td>
                    <td>Rp {(order.total || order.amount)?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/reseller/orders/${order.id}`} className="admin-btn admin-btn-sm">
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

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="admin-card" style={{ marginTop: 'var(--space-lg)' }}>
          <div className="admin-card-header">
            <h2>Produk Teratas</h2>
            <Link to="/reseller/products" className="admin-link">Kelola Produk</Link>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>Rp {product.price?.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.status || (product.stock > 0 ? 'aktif' : 'habis')}`}>
                        {product.status || (product.stock > 0 ? 'aktif' : 'habis')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResellerDashboard;