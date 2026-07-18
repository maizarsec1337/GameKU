import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function formatAddress(addr) {
  if (!addr) return null;
  return {
    id: addr.id || addr._id,
    label: addr.label || addr.title || 'Alamat',
    recipient: addr.recipient_name || addr.name || '-',
    phone: addr.phone || addr.phone_number || '-',
    address: addr.address || addr.street || '-',
    city: addr.city || '-',
    province: addr.province || '-',
    postalCode: addr.postal_code || addr.zip || '-',
    isDefault: addr.is_default || addr.isDefault || false
  };
}

function UserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/addresses');
      if (response.data && response.data.success) {
        const list = (response.data.data || []).map(formatAddress);
        setAddresses(list);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await api.put(`/user/addresses/${editingId}`, formData);
        if (response.data && response.data.success) {
          await fetchAddresses();
          resetForm();
        }
      } else {
        const response = await api.post('/user/addresses', formData);
        if (response.data && response.data.success) {
          await fetchAddresses();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan alamat');
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label || '',
      recipient_name: addr.recipient || '',
      phone: addr.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      province: addr.province || '',
      postal_code: addr.postalCode || '',
      is_default: addr.isDefault || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus alamat ini?')) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Gagal menghapus alamat');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      label: '',
      recipient_name: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postal_code: '',
      is_default: false
    });
  };

  if (loading) {
    return <div className="admin-loading">Memuat alamat...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Alamat Saya</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Tambah Alamat
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>{editingId ? 'Edit Alamat' : 'Tambah Alamat'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Label Alamat</label>
              <input
                type="text"
                value={formData.label}
                onChange={e => setFormData({...formData, label: e.target.value})}
                placeholder="Contoh: Rumah, Kantor"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Nama Penerima</label>
              <input
                type="text"
                value={formData.recipient_name}
                onChange={e => setFormData({...formData, recipient_name: e.target.value})}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Nomor Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Alamat Lengkap</label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                rows="3"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="admin-form-group">
                <label>Kota</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Provinsi</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={e => setFormData({...formData, province: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Kode Pos</label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={e => setFormData({...formData, postal_code: e.target.value})}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={e => setFormData({...formData, is_default: e.target.checked})}
                />
                Jadi alamat utama
              </label>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button type="submit" className="admin-btn admin-btn-success">Simpan</button>
              <button type="button" className="admin-btn" onClick={resetForm}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="admin-empty">
          <p>Belum ada alamat</p>
          <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
            Tambah Alamat Pertama
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Penerima</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Kota</th>
                <th>Provinsi</th>
                <th>Kode Pos</th>
                <th>Utama</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(addr => (
                <tr key={addr.id}>
                  <td>{addr.label}</td>
                  <td>{addr.recipient}</td>
                  <td>{addr.phone}</td>
                  <td>{addr.address}</td>
                  <td>{addr.city}</td>
                  <td>{addr.province}</td>
                  <td>{addr.postalCode}</td>
                  <td>
                    <span className={`status-badge ${addr.isDefault ? 'completed' : 'pending'}`}>
                      {addr.isDefault ? 'Utama' : 'Tidak'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleEdit(addr)}>
                        Edit
                      </button>
                      <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(addr.id)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserAddresses;