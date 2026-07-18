import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function ResellerSaldo() {
  const [saldo, setSaldo] = useState(0);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaldo();
  }, []);

  const fetchSaldo = async () => {
    try {
      const [statsRes, withdrawsRes] = await Promise.all([
        api.getResellerStats().catch(() => ({ data: { success: false, data: {} } })),
        api.resellerWithdraws().catch(() => ({ data: { success: false, data: [] } }))
      ]);

      const stats = statsRes.data?.data || {};
      setSaldo(stats.balance || 0);
      setWithdraws(withdrawsRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching saldo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat saldo...</div>;
  }

  const totalWithdraw = withdraws.reduce((sum, w) => sum + (w.amount || 0), 0);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Saldo Internal</h1>

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Saldo Saat Ini</h3>
            <p className="stat-value">Rp {saldo?.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Withdraw</h3>
            <p className="stat-value">Rp {totalWithdraw?.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Jumlah Withdraw</h3>
            <p className="stat-value">{withdraws.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Withdraws */}
      <div className="admin-card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="admin-card-header">
          <h2>Riwayat Withdraw</h2>
        </div>
        {withdraws.length === 0 ? (
          <div className="admin-empty">
            <p>Belum ada withdraw</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Jumlah</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {withdraws.map(w => (
                  <tr key={w.id}>
                    <td>#{w.id}</td>
                    <td>Rp {(w.amount)?.toLocaleString()}</td>
                    <td>{w.method || '-'}</td>
                    <td>
                      <span className={`status-badge ${w.status}`}>
                        {w.status}
                      </span>
                    </td>
                    <td>
                      {new Date(w.created_at || w.createdAt).toLocaleDateString('id-ID')}
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

export default ResellerSaldo;
