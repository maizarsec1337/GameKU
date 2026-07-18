import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/authAPI';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/user/orders');
      if (response.data && response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
      case 'menunggu':
        return 'pending';
      case 'processing':
      case 'diproses':
        return 'processing';
      case 'completed':
      case 'selesai':
        return 'completed';
      case 'cancelled':
      case 'dibatalkan':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat pesanan...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <p>Belum ada pesanan</p>
          <Link to="/" className="admin-btn admin-btn-primary">Belanja Sekarang</Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at || order.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>Rp {(order.total || order.amount)?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/user/orders/${order.id}`} className="admin-btn admin-btn-sm admin-btn-primary">
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
  );
}

export default UserOrders;