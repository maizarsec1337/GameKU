import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function ResellerWithdraw() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', method: 'bank', bank_name: '', account_number: '', account_holder_name: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const fetchWithdraws = async () => {
    try {
      const response = await api.resellerWithdraws();
      if (response.data && response.data.success) {
        setWithdraws(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching withdraws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await api.createWithdraw(formData);
      if (response.data && response.data.success) {
        setMessage({ type: 'success', text: 'Permintaan withdraw berhasil dikirim' });
        setFormData({ amount: '', method: 'bank', bank_name: '', account_number: '', account_holder_name: '' });
        setShowForm(false);
        fetchWithdraws();
      } else {
        setMessage({ type: 'error', text: response.data?.message || 'Gagal mengajukan withdraw' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat withdraw...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Withdraw</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Ajukan Withdraw'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Jumlah</label>
            <input
              type="number"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Metode</label>
            <select
              value={formData.method}
              onChange={e => setFormData({...formData, method: e.target.value})}
            >
              <option value="bank">Bank Transfer</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>
          <button type="submit" className="admin-btn admin-btn-success">Ajukan</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Jumlah</th>
              <th>Metode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {withdraws.map(withdraw => (
              <tr key={withdraw.id}>
                <td>{withdraw.id}</td>
                <td>Rp {withdraw.amount?.toLocaleString()}</td>
                <td>{withdraw.method}</td>
                <td>
                  <span className={`status-badge ${withdraw.status}`}>
                    {withdraw.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResellerWithdraw;