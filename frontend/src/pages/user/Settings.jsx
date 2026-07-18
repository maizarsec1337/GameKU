import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/authAPI';

function UserSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setLoading(false);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.put('/user/profile', formData);
      if (response.data && response.data.success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
      } else {
        setMessage({ type: 'error', text: response.data?.message || 'Gagal memperbarui profil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat pengaturan...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Pengaturan Akun</h1>

      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <form className="admin-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`admin-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="admin-form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Nomor Telepon</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <button type="submit" className="admin-btn admin-btn-success" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;