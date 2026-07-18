import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/authAPI';

function ResellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.resellerOrders();
      if (response.data && response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Gagal memperbarui status pesanan');
    }
  };

  const getStatusOptions = (currentStatus) => {
    const statuses = [
      { value: 'pending', label: 'Menunggu' },
      { value: 'processing', label: 'Diproses' },
      { value: 'shipping', label: 'Dikirim' },
      { value: 'completed', label: 'Selesai' },
      { value: 'cancelled', label: 'Dibatalkan' }
    ];
    return statuses.filter(s => s.value !== currentStatus);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  if (loading) {
    return <div className="admin-loading">Memuat pesanan...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Pesanan</h1>

      {/* Stats */}
      <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="admin-stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pesanan</h3>
            <p className="stat-value">{orderStats.total}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Menunggu</h3>
            <p className="stat-value">{orderStats.pending}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Diproses</h3>
            <p className="stat-value">{orderStats.processing}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Selesai</h3>
            <p className="stat-value">{orderStats.completed}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="admin-form-group" style={{ marginBottom: 0 }}>
          <label>Filter Status</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="all">Semua</option>
            <option value="pending">Menunggu</option>
            <option value="processing">Diproses</option>
            <option value="shipping">Dikirim</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="admin-empty">
          <p>Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produk</th>
                <th>Pembeli</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.product_name || `Produk #${order.product_id}`}</td>
                  <td>{order.user_name || order.user_email || `User #${order.user_id}`}</td>
                  <td>Rp {(order.total || order.amount)?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {new Date(order.created_at || order.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      className="admin-select"
                    >
                      {getStatusOptions(order.status).map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResellerOrders;
