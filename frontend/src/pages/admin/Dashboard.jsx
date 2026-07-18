import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data && response.data.success) {
        setStats(response.data.stats);
      }
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
      <h1 className="admin-page-title">Dashboard Admin</h1>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Pengguna</h3>
            <p className="stat-value">{stats?.total_users || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Produk</h3>
            <p className="stat-value">{stats?.total_products || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pesanan</h3>
            <p className="stat-value">{stats?.total_orders || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <h3>Total Reseller</h3>
            <p className="stat-value">{stats?.total_resellers || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Revenue Hari Ini</h3>
            <p className="stat-value">Rp {(stats?.revenue_today || 0).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pesanan Pending</h3>
            <p className="stat-value">{stats?.orders_pending || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;