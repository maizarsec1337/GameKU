import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      if (response.data && response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}`, { status });
      if (response.data && response.data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? {...order, status} : order
        ));
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const statusOptions = ['draft', 'pending', 'diproses', 'selesai', 'dibatalkan', 'refund'];

  if (loading) {
    return <div className="admin-loading">Memuat pesanan...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Pesanan</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Produk ID</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>{order.product_id}</td>
                <td>Rp {order.amount?.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="admin-select"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;