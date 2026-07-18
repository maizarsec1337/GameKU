import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function UserPaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'bank',
    bank_name: '',
    account_number: '',
    account_holder_name: '',
    ewallet_type: '',
    ewallet_number: '',
    is_default: false
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/user/payment-methods');
      if (response.data && response.data.success) {
        setMethods(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/user/payment-methods/${editingId}`, formData);
      } else {
        await api.post('/user/payment-methods', formData);
      }
      await fetchPaymentMethods();
      resetForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan metode pembayaran');
    }
  };

  const handleEdit = (method) => {
    setEditingId(method.id);
    setFormData({
      type: method.type || 'bank',
      bank_name: method.bank_name || '',
      account_number: method.account_number || '',
      account_holder_name: method.account_holder_name || '',
      ewallet_type: method.ewallet_type || '',
      ewallet_number: method.ewallet_number || '',
      is_default: method.is_default || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus metode pembayaran ini?')) return;
    try {
      await api.delete(`/user/payment-methods/${id}`);
      setMethods(methods.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Gagal menghapus metode pembayaran');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      type: 'bank',
      bank_name: '',
      account_number: '',
      account_holder_name: '',
      ewallet_type: '',
      ewallet_number: '',
      is_default: false
    });
  };

  const getMethodIcon = (type) => {
    return type === 'bank' ? '🏦' : '📱';
  };

  if (loading) {
    return <div className="admin-loading">Memuat metode pembayaran...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Metode Pembayaran</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Tambah Metode
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>{editingId ? 'Edit Metode' : 'Tambah Metode'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Tipe</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="bank">Bank Transfer</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>

            {formData.type === 'bank' ? (
              <>
                <div className="admin-form-group">
                  <label>Nama Bank</label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={e => setFormData({...formData, bank_name: e.target.value})}
                    placeholder="Contoh: BCA, Mandiri, BNI"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={e => setFormData({...formData, account_number: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    value={formData.account_holder_name}
                    onChange={e => setFormData({...formData, account_holder_name: e.target.value})}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="admin-form-group">
                  <label>Tipe E-Wallet</label>
                  <select
                    value={formData.ewallet_type}
                    onChange={e => setFormData({...formData, ewallet_type: e.target.value})}
                    required
                  >
                    <option value="">Pilih E-Wallet</option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                    <option value="shopeepay">ShopeePay</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Nomor E-Wallet</label>
                  <input
                    type="text"
                    value={formData.ewallet_number}
                    onChange={e => setFormData({...formData, ewallet_number: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            <div className="admin-form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={e => setFormData({...formData, is_default: e.target.checked})}
                />
                Jadi metode utama
              </label>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button type="submit" className="admin-btn admin-btn-success">Simpan</button>
              <button type="button" className="admin-btn" onClick={resetForm}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {methods.length === 0 ? (
        <div className="admin-empty">
          <p>Belum ada metode pembayaran</p>
          <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
            Tambah Metode Pembayaran
          </button>
        </div>
      ) : (
        <div className="admin-grid">
          {methods.map(method => (
            <div key={method.id} className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
                    {getMethodIcon(method.type)}
                  </div>
                  <h3 style={{ marginBottom: 'var(--space-xs)' }}>
                    {method.type === 'bank' ? method.bank_name : method.ewallet_type?.toUpperCase()}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
                    {method.type === 'bank' 
                      ? `****${method.account_number?.slice(-4)}`
                      : method.ewallet_number}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', marginTop: 'var(--space-xs)' }}>
                    {method.account_holder_name}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button 
                    className="admin-btn admin-btn-sm admin-btn-primary" 
                    onClick={() => handleEdit(method)}
                  >
                    Edit
                  </button>
                  <button 
                    className="admin-btn admin-btn-sm admin-btn-danger" 
                    onClick={() => handleDelete(method.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
              {method.is_default && (
                <span className="status-badge completed" style={{ marginTop: 'var(--space-sm)', display: 'inline-block' }}>
                  Utama
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPaymentMethods;