import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function ResellerStatistik() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
    ordersByDate: {}
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.resellerProducts().catch(() => ({ data: { success: false, data: [] } })),
        api.resellerOrders().catch(() => ({ data: { success: false, data: [] } }))
      ]);

      const productsData = productsRes.data?.data || [];
      const ordersData = ordersRes.data?.data || [];

      const totalRevenue = ordersData.reduce((sum, o) => sum + (o.total || o.amount || 0), 0);
      const completed = ordersData.filter(o => o.status === 'completed' || o.status === 'selesai');
      const pending = ordersData.filter(o => o.status === 'pending');
      const cancelled = ordersData.filter(o => o.status === 'cancelled' || o.status === 'dibatalkan');

      const ordersByDate = ordersData.reduce((acc, order) => {
        const date = new Date(order.created_at || order.createdAt).toLocaleDateString('id-ID');
        acc[date] = (acc[date] || 0) + (order.total || order.amount || 0);
        return acc;
      }, {});

      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        totalProducts: productsData.length,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        cancelledOrders: cancelled.length,
        averageOrderValue: ordersData.length > 0 ? Math.round(totalRevenue / ordersData.length) : 0,
        ordersByDate
      });

      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat statistik...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Statistik Penjualan</h1>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Produk</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pesanan</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Pendapatan</h3>
            <p className="stat-value">Rp {stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>Rata-rata Order</h3>
            <p className="stat-value">Rp {stats.averageOrderValue.toLocaleString()}</p>
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
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Dibatalkan</h3>
            <p className="stat-value">{stats.cancelledOrders}</p>
          </div>
        </div>
      </div>

      {/* Revenue by Date Table */}
      {Object.keys(stats.ordersByDate).length > 0 && (
        <div className="admin-card" style={{ marginTop: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Pendapatan per Tanggal</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.ordersByDate).map(([date, revenue]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>Rp {revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Performance */}
      {products.length > 0 && (
        <div className="admin-card" style={{ marginTop: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Performa Produk</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>Rp {product.price?.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.stock > 0 ? 'completed' : 'cancelled'}`}>
                        {product.stock > 0 ? 'Tersedia' : 'Habis'}
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

export default ResellerStatistik;