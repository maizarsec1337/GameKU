import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminResellers() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showImageModal, setShowImageModal] = useState({ show: false, src: '', title: '' });

  useEffect(() => {
    fetchResellers();
  }, []);

  const fetchResellers = async () => {
    try {
      const response = await api.get('/admin/resellers');
      if (response.data && response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    if (!confirm(`Yakin ingin ${action === 'approve' ? 'menyetujui' : action === 'reject' ? 'menolak' : 'menangguhkan'} reseller ini?`)) {
      return;
    }

    setActionLoading(id);
    
    try {
      const response = await api.put(`/admin/resellers/${id}/verify`, { action });
      
      if (response.data && response.data.success) {
        fetchResellers();
        alert(`Reseller berhasil ${action === 'approve' ? 'disetujui' : action === 'reject' ? 'ditolak' : 'ditangguhkan'}`);
      }
    } catch (error) {
      console.error('Verify error:', error);
      alert(error.response?.data?.message || 'Gagal memverifikasi reseller');
    } finally {
      setActionLoading(null);
    }
  };

  const openImagePreview = (src, title) => {
    setShowImageModal({ show: true, src, title });
  };

  const closeImagePreview = () => {
    setShowImageModal({ show: false, src: '', title: '' });
  };

  if (loading) {
    return <div className="admin-loading">Memuat reseller...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Reseller</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Toko</th>
              <th>Pemilik</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Alamat</th>
              <th>Foto KTP</th>
              <th>Foto Selfie</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {resellers.map(reseller => (
              <tr key={reseller.id}>
                <td>{reseller.id}</td>
                <td>{reseller.storeName || reseller.name}</td>
                <td>{reseller.fullName || reseller.owner}</td>
                <td>{reseller.email}</td>
                <td>{reseller.phone}</td>
                <td>{reseller.address || '-'}</td>
                <td>
                  {reseller.ktpImage && (
                    <button 
                      onClick={() => openImagePreview(reseller.ktpImage, 'Foto KTP')}
                      className="admin-btn admin-btn-sm"
                    >
                      Lihat
                    </button>
                  )}
                </td>
                <td>
                  {reseller.selfieImage && (
                    <button 
                      onClick={() => openImagePreview(reseller.selfieImage, 'Foto Selfie')}
                      className="admin-btn admin-btn-sm"
                    >
                      Lihat
                    </button>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${reseller.status || reseller.verificationStatus}`}>
                    {reseller.status || reseller.verificationStatus}
                  </span>
                </td>
                <td>
                  {(reseller.status === 'pending' || reseller.verificationStatus === 'pending') && (
                    <>
                      <button 
                        onClick={() => handleVerify(reseller.id, 'approve')}
                        className="admin-btn admin-btn-sm admin-btn-success"
                        disabled={actionLoading === reseller.id}
                        style={{ marginRight: '5px' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleVerify(reseller.id, 'reject')}
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        disabled={actionLoading === reseller.id}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {reseller.status === 'approved' && (
                    <button 
                      onClick={() => handleVerify(reseller.id, 'suspend')}
                      className="admin-btn admin-btn-sm admin-btn-warning"
                      disabled={actionLoading === reseller.id}
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {showImageModal.show && (
        <div className="modal-overlay" onClick={closeImagePreview}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showImageModal.title}</h3>
              <button onClick={closeImagePreview} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <img 
                src={showImageModal.src} 
                alt={showImageModal.title} 
                style={{ maxWidth: '100%', maxHeight: '500px' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResellers;