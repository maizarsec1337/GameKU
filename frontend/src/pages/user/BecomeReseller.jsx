import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/authAPI';

function BecomeReseller() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [errors, setErrors] = useState({});
  const [previewKtp, setPreviewKtp] = useState(null);
  const [previewSelfie, setPreviewSelfie] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    storeUsername: '',
    storeName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postalCode: '',
    agreeTerms: false
  });

  const [files, setFiles] = useState({
    ktp_image: null,
    selfie_image: null,
    store_logo: null
  });

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const checkExistingApplication = async () => {
    try {
      const response = await api.get('/reseller/status');
      if (response.data && response.data.success && response.data.data?.status) {
        setExistingApplication(response.data.data);
      }
    } catch (error) {
      console.error('Error checking application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList?.[0];
    
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: 'Ukuran file maksimal 5MB' }));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: 'Format file harus JPG, JPEG, PNG, atau WebP' }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (name === 'ktp_image') setPreviewKtp(e.target.result);
        if (name === 'selfie_image') setPreviewSelfie(e.target.result);
      };
      reader.readAsDataURL(file);

      setFiles(prev => ({ ...prev, [name]: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.storeUsername.trim()) newErrors.storeUsername = 'Username toko wajib diisi';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.storeUsername)) 
      newErrors.storeUsername = 'Username hanya boleh huruf, angka, dan underscore';
    if (!formData.storeName.trim()) newErrors.storeName = 'Nama toko wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    else if (!/^08[0-9]{8,12}$/.test(formData.phone)) 
      newErrors.phone = 'Format nomor telepon tidak valid (harus diawali 08)';
    if (!formData.province.trim()) newErrors.province = 'Provinsi wajib diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
    if (!formData.district.trim()) newErrors.district = 'Kecamatan wajib diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Kode pos wajib diisi';
    if (!files.ktp_image) newErrors.ktp_image = 'Foto KTP wajib diupload';
    if (!files.selfie_image) newErrors.selfie_image = 'Foto selfie wajib diupload';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Add files
      if (files.ktp_image) submitData.append('ktp_image', files.ktp_image);
      if (files.selfie_image) submitData.append('selfie_image', files.selfie_image);
      if (files.store_logo) submitData.append('store_logo', files.store_logo);

      const response = await api.post('/reseller/register', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.success) {
        alert('Permohonan reseller berhasil dikirim! Menunggu verifikasi admin.');
        navigate('/user');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(error.response?.data?.message || 'Gagal mengirim permohonan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat...</div>;
  }

  // Show existing application status
  if (existingApplication?.status) {
    const statusInfo = {
      pending: { title: 'Menunggu Verifikasi', color: '#ffc107' },
      approved: { title: 'Disetujui', color: '#28a745' },
      rejected: { title: 'Ditolak', color: '#dc3545' },
      suspended: { title: 'Ditangguhkan', color: '#6c757d' }
    };

    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Daftar Menjadi Reseller</h1>
        
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Status Permohonan Reseller</h2>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ 
              backgroundColor: statusInfo[existingApplication.status]?.color || '#17a2b8',
              color: 'white',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0 }}>{statusInfo[existingApplication.status]?.title}</h3>
            </div>
            
            {existingApplication.rejectionReason && (
              <div style={{ 
                backgroundColor: '#f8d7da', 
                padding: '15px', 
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                <strong>Alasan Penolakan:</strong> {existingApplication.rejectionReason}
              </div>
            )}
            
            <p>Toko: {existingApplication.storeName}</p>
            <p>Username: {existingApplication.storeUsername}</p>
            
            <button 
              onClick={() => navigate('/user')}
              className="admin-btn admin-btn-primary"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Daftar Menjadi Reseller</h1>
      
      <form onSubmit={handleSubmit} className="admin-form">
        {/* Account Data */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Data Akun</h2>
          </div>
          
          <div style={{ padding: '20px' }}>
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
              <label>Username Toko *</label>
              <input
                type="text"
                name="storeUsername"
                value={formData.storeUsername}
                onChange={handleInputChange}
                placeholder="Tanpa spasi, hanya huruf, angka, dan underscore"
                className={errors.storeUsername ? 'error' : ''}
              />
              {errors.storeUsername && <span className="error-text">{errors.storeUsername}</span>}
            </div>

            <div className="form-group">
              <label>Nama Toko *</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                className={errors.storeName ? 'error' : ''}
              />
              {errors.storeName && <span className="error-text">{errors.storeName}</span>}
            </div>

            <div className="form-group">
              <label>Nomor Telepon *</label>
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
          </div>
        </div>

        {/* Address */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Alamat</h2>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div className="form-group">
              <label>Provinsi *</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className={errors.province ? 'error' : ''}
              />
              {errors.province && <span className="error-text">{errors.province}</span>}
            </div>

            <div className="form-group">
              <label>Kota *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>Kecamatan *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={errors.district ? 'error' : ''}
              />
              {errors.district && <span className="error-text">{errors.district}</span>}
            </div>

            <div className="form-group">
              <label>Alamat Lengkap *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Kode Pos *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={errors.postalCode ? 'error' : ''}
              />
              {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Upload Dokumen</h2>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div className="form-group">
              <label>Foto KTP (JPG, JPEG, PNG, WebP - Maks 5MB) *</label>
              <input
                type="file"
                name="ktp_image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className={errors.ktp_image ? 'error' : ''}
              />
              {errors.ktp_image && <span className="error-text">{errors.ktp_image}</span>}
              {previewKtp && (
                <img src={previewKtp} alt="Preview KTP" style={{ maxWidth: '200px', marginTop: '10px' }} />
              )}
            </div>

            <div className="form-group">
              <label>Foto Selfie/Wajah untuk Verifikasi (JPG, JPEG, PNG, WebP - Maks 5MB) *</label>
              <input
                type="file"
                name="selfie_image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className={errors.selfie_image ? 'error' : ''}
              />
              {errors.selfie_image && <span className="error-text">{errors.selfie_image}</span>}
              {previewSelfie && (
                <img src={previewSelfie} alt="Preview Selfie" style={{ maxWidth: '200px', marginTop: '10px' }} />
              )}
            </div>

            <div className="form-group">
              <label>Logo Toko (Opsional - JPG, JPEG, PNG, WebP - Maks 5MB)</label>
              <input
                type="file"
                name="store_logo"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="admin-card">
          <div style={{ padding: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <span>Saya menyetujui syarat dan ketentuan menjadi reseller *</span>
              </label>
              {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
            </div>

            <button 
              type="submit" 
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Kirim Permohonan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BecomeReseller;