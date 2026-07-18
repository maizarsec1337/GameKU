import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function UserVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await api.get('/user/vouchers');
      if (response.data && response.data.success) {
        setVouchers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
      case 'aktif':
        return 'completed';
      case 'used':
      case 'terpakai':
        return 'pending';
      case 'expired':
      case 'kedaluwarsa':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat voucher...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Voucher Saya</h1>

      {vouchers.length === 0 ? (
        <div className="admin-empty">
          <p>Belum ada voucher</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Diskon</th>
                <th>Min. Pembelian</th>
                <th>Berlaku Hingga</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(voucher => (
                <tr key={voucher.id}>
                  <td><code>{voucher.code}</code></td>
                  <td>{voucher.name}</td>
                  <td>{voucher.discount_type === 'percentage' ? `${voucher.discount_value}%` : `Rp ${voucher.discount_value?.toLocaleString()}`}</td>
                  <td>Rp {voucher.min_purchase?.toLocaleString()}</td>
                  <td>{new Date(voucher.expires_at || voucher.expired_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(voucher.status)}`}>
                      {voucher.status}
                    </span>
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

export default UserVouchers;