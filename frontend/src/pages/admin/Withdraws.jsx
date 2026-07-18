import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminWithdraws() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const fetchWithdraws = async () => {
    try {
      const response = await api.get('/admin/withdraws');
      if (response.data && response.data.success) {
        setWithdraws(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching withdraws:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWithdrawStatus = async (withdrawId, status) => {
    try {
      const response = await api.put(`/admin/withdraws/${withdrawId}`, { status });
      if (response.data && response.data.success) {
        setWithdraws(withdraws.map(w => 
          w.id === withdrawId ? {...w, status} : w
        ));
      }
    } catch (error) {
      console.error('Error updating withdraw:', error);
    }
  };

  const statusOptions = ['pending', 'approved', 'rejected', 'success'];

  if (loading) {
    return <div className="admin-loading">Memuat withdraw...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Withdraw</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reseller ID</th>
              <th>Jumlah</th>
              <th>Metode</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {withdraws.map(withdraw => (
              <tr key={withdraw.id}>
                <td>{withdraw.id}</td>
                <td>{withdraw.reseller_id}</td>
                <td>Rp {withdraw.amount?.toLocaleString()}</td>
                <td>{withdraw.method}</td>
                <td>
                  <span className={`status-badge ${withdraw.status}`}>
                    {withdraw.status}
                  </span>
                </td>
                <td>
                  <select
                    value={withdraw.status}
                    onChange={e => updateWithdrawStatus(withdraw.id, e.target.value)}
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

export default AdminWithdraws;