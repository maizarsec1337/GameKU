import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      if (response.data && response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/categories', formData);
      if (response.data && response.data.success) {
        setCategories([...categories, response.data.data]);
        setFormData({ name: '', slug: '', icon: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat kategori...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kelola Kategori</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Kategori'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={e => setFormData({...formData, icon: e.target.value})}
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
              <th>Nama</th>
              <th>Slug</th>
              <th>Icon</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.icon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategories;