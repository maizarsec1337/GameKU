import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', discount: '' });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await api.get('/admin/vouchers');
      if (response.data && response.data.success) {
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/vouchers', {
        ...formData,
        discount: parseInt(formData.discount)
      });
      if (response.data && response.data.success) {
        setVouchers([...vouchers, response.data.data]);
        setFormData({ code: '', discount: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating voucher:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat voucher...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kelola Voucher</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Voucher'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Kode Voucher</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Diskon (%)</label>
            <input
              type="number"
              value={formData.discount}
              onChange={e => setFormData({...formData, discount: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-success">Simpan</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode</th>
              <th>Diskon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map(voucher => (
              <tr key={voucher.id}>
                <td>{voucher.id}</td>
                <td>{voucher.code}</td>
                <td>{voucher.discount}%</td>
                <td>
                  <span className={`status-badge ${voucher.active ? 'active' : 'inactive'}`}>
                    {voucher.active ? 'Aktif' : 'Tidak Aktif'}
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

export default AdminVouchers;