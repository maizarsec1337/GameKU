import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', image: '', link: '' });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/admin/banners');
      if (response.data && response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/banners', formData);
      if (response.data && response.data.success) {
        setBanners([...banners, response.data.data]);
        setFormData({ title: '', image: '', link: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat banner...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kelola Banner</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Banner'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Judul</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>URL Gambar</label>
            <input
              type="text"
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Link</label>
            <input
              type="text"
              value={formData.link}
              onChange={e => setFormData({...formData, link: e.target.value})}
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
              <th>Gambar</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => (
              <tr key={banner.id}>
                <td>{banner.id}</td>
                <td>{banner.title}</td>
                <td>{banner.image}</td>
                <td>
                  <span className={`status-badge ${banner.active ? 'active' : 'inactive'}`}>
                    {banner.active ? 'Aktif' : 'Tidak Aktif'}
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

export default AdminBanners;