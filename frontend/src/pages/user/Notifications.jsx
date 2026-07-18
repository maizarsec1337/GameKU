import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/user/notifications');
      if (response.data && response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
      case 'pesanan':
        return '🛒';
      case 'promo':
        return '🎉';
      case 'voucher':
        return '🎫';
      case 'system':
      case 'sistem':
        return '🔔';
      default:
        return '📢';
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat notifikasi...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Notifikasi</h1>

      {notifications.length === 0 ? (
        <div className="admin-empty">
          <p>Tidak ada notifikasi</p>
        </div>
      ) : (
        <div className="admin-list">
          {notifications.map(notif => (
            <div key={notif.id} className="admin-list-item">
              <div style={{ fontSize: '2rem', marginRight: 'var(--space-md)' }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 'var(--space-xs)' }}>{notif.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
                  {notif.message}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', marginTop: 'var(--space-xs)' }}>
                  {new Date(notif.created_at || notif.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              {!notif.is_read && (
                <span className="status-badge pending" style={{ alignSelf: 'flex-start' }}>
                  Baru
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserNotifications;