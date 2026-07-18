import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import { useAuth } from '../context/AuthContext';
import assets from '../config/assetConfig';
import '../css/auth.css';

function Profile() {
  const navigate = useNavigate();
  const { user: authUser, logout, checkAuth } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resellerStatus, setResellerStatus] = useState({ status: 'belum' });
  const [resellerLoading, setResellerLoading] = useState(false);
  const [resellerForm, setResellerForm] = useState({
    ktp_photo: null,
    selfie_with_ktp: null,
    bank_account: '',
    account_holder_name: '',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchResellerStatus();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.me();
      const data = response.data || response;
      if (data.success) {
        setUser(data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchResellerStatus = async () => {
    try {
      const response = await authAPI.getResellerStatus();
      const data = response.data || response;
      if (data.success) {
        setResellerStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch reseller status', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleResellerSubmit = async (e) => {
    e.preventDefault();
    setResellerLoading(true);
    
    try {
      const response = await authAPI.registerReseller(resellerForm);
      const data = response.data || response;
      if (data.success) {
        setResellerStatus({ status: 'proses' });
        await checkAuth(); // Refresh user data
        alert('Pengajuan reseller berhasil dikirim! Menunggu verifikasi.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengajukan reseller');
    } finally {
      setResellerLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setResellerForm(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResellerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'user': return 'user';
      case 'reseller': return 'reseller';
      case 'admin': return 'admin';
      case 'super_admin': return 'super-admin';
      default: return 'user';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'belum': return 'belum';
      case 'proses': return 'proses';
      case 'disetujui': return 'disetujui';
      case 'ditolak': return 'ditolak';
      default: return 'belum';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'belum': return 'Belum Mengajukan';
      case 'proses': return 'Diproses';
      case 'disetujui': return 'Disetujui';
      case 'ditolak': return 'Ditolak';
      default: return 'Belum Mengajukan';
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-loading" style={{ color: 'var(--white)' }}>
          <span className="auth-spinner"></span>
          Memuat profil...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profil Pengguna</h1>
        </div>

        <div className="profile-card">
          <img 
            src={user?.photoURL || user?.avatar || assets.avatar.default.file} 
            alt="Profile" 
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2>{user?.fullName || user?.email}</h2>
            <span className={`profile-role ${getRoleClass(user?.role)}`}>
              {user?.role === 'super_admin' ? 'SUPER ADMIN' : user?.role?.toUpperCase()}
            </span>

            <div className="profile-details">
              <div className="profile-detail-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>

              <div className="profile-detail-item">
                <label>Terdaftar Sejak</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reseller Section */}
        <div className="profile-reseller">
          <h3>Program Reseller</h3>
          
          {user?.role === 'user' && (
            <>
              <div className="reseller-status">
                <span>Status Pengajuan:</span>
                <span className={`reseller-status-badge ${getStatusClass(resellerStatus.status)}`}>
                  {getStatusText(resellerStatus.status)}
                </span>
              </div>

              {resellerStatus.status === 'belum' && (
                <form className="reseller-form" onSubmit={handleResellerSubmit}>
                  <h4>Formulir Pendaftaran Reseller</h4>

                  <div className="reseller-upload-group">
                    <span className="reseller-upload-label">Foto KTP</span>
                    <label className="reseller-upload">
                      <input
                        type="file"
                        name="ktp_photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      <span className="reseller-upload-btn">
                        Pilih File {resellerForm.ktp_photo && `(${resellerForm.ktp_photo.name})`}
                      </span>
                    </label>
                  </div>

                  <div className="reseller-upload-group">
                    <span className="reseller-upload-label">Selfie dengan KTP</span>
                    <label className="reseller-upload">
                      <input
                        type="file"
                        name="selfie_with_ktp"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      <span className="reseller-upload-btn">
                        Pilih File {resellerForm.selfie_with_ktp && `(${resellerForm.selfie_with_ktp.name})`}
                      </span>
                    </label>
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="bank_account">Nomor Rekening</label>
                    <input
                      id="bank_account"
                      name="bank_account"
                      type="text"
                      placeholder="Nomor rekening bank"
                      value={resellerForm.bank_account}
                      onChange={handleInputChange}
                      className="auth-input"
                      required
                    />
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="account_holder_name">Nama Pemilik Rekening</label>
                    <input
                      id="account_holder_name"
                      name="account_holder_name"
                      type="text"
                      placeholder="Nama sesuai rekening bank"
                      value={resellerForm.account_holder_name}
                      onChange={handleInputChange}
                      className="auth-input"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="auth-btn auth-btn-primary"
                    disabled={resellerLoading}
                  >
                    {resellerLoading ? (
                      <span className="auth-loading">
                        <span className="auth-spinner"></span>
                        Mengirim...
                      </span>
                    ) : (
                      'Daftar Menjadi Reseller'
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {user?.role === 'reseller' && (
            <div className="reseller-status">
              <span>Status:</span>
              <span className="reseller-status-badge disetujui">
                Reseller Aktif
              </span>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <button 
            onClick={handleLogout}
            className="auth-btn auth-btn-google"
            style={{ maxWidth: '200px' }}
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;