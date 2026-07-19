import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/authAPI';

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data && response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat profil...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Profil Saya</h1>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Informasi Profil</h2>
        </div>
        
        <div className="profile-info" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>Nama Lengkap:</strong> {profile?.fullName || user?.fullName || '-'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Email:</strong> {profile?.email || user?.email || '-'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Nomor Telepon:</strong> {profile?.phone || user?.phone || '-'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;