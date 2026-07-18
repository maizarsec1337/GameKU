import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', discount: '' });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await api.get('/admin/promos');
      if (response.data && response.data.success) {
        setPromos(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/promos', {
        ...formData,
        discount: parseInt(formData.discount)
      });
      if (response.data && response.data.success) {
        setPromos([...promos, response.data.data]);
        setFormData({ title: '', discount: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating promo:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat promo...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kelola Promo</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Promo'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Judul Promo</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
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
              <th>Judul</th>
              <th>Diskon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(promo => (
              <tr key={promo.id}>
                <td>{promo.id}</td>
                <td>{promo.title}</td>
                <td>{promo.discount}%</td>
                <td>
                  <span className={`status-badge ${promo.active ? 'active' : 'inactive'}`}>
                    {promo.active ? 'Aktif' : 'Tidak Aktif'}
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

export default AdminPromos;