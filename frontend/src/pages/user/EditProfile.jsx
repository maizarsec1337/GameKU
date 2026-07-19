import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/authAPI';

function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (formData.phone && !/^08[0-9]{8,12}$/.test(formData.phone)) 
      newErrors.phone = 'Format nomor telepon tidak valid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    try {
      const response = await api.put('/user/profile', formData);
      
      if (response.data && response.data.success) {
        alert('Profil berhasil diperbarui');
        navigate('/user/profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Edit Profil</h1>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Ubah Informasi Profil</h2>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="disabled"
            />
            <small>Email tidak dapat diubah</small>
          </div>

          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="08xxxxxxxxxx"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="admin-btn admin-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;