import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/authAPI';

function ResellerStore() {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const response = await api.getStore();
      if (response.data && response.data.success) {
        const storeData = response.data.data;
        setStore(storeData);
        setFormData({
          name: storeData.name || user?.fullName || '',
          description: storeData.description || '',
          address: storeData.address || '',
          phone: storeData.phone || user?.phone || '',
          email: storeData.email || user?.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.updateStore(formData);
      if (response.data && response.data.success) {
        setMessage({ type: 'success', text: 'Toko berhasil diperbarui' });
        setStore(response.data.data);
      } else {
        setMessage({ type: 'error', text: response.data?.message || 'Gagal memperbarui toko' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat toko...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Toko</h1>

      <div className="admin-card" style={{ maxWidth: '800px' }}>
        <form className="admin-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`admin-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="admin-form-group">
            <label>Nama Toko</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Nama toko Anda"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Deskripsi Toko</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows="4"
              placeholder="Ceritakan tentang toko Anda"
            />
          </div>

          <div className="admin-form-group">
            <label>Alamat Toko</label>
            <textarea
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              rows="3"
              placeholder="Alamat lengkap toko"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="admin-form-group">
              <label>Email Toko</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="email@tokku.com"
              />
            </div>
            <div className="admin-form-group">
              <label>Telepon Toko</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="Nomor telepon"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Status Toko</label>
            <span className={`status-badge ${store?.status || 'aktif'}`}>
              {store?.status || 'aktif'}
            </span>
          </div>

          <button type="submit" className="admin-btn admin-btn-success" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResellerStore;
