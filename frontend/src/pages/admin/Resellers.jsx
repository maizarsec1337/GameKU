import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminResellers() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <th>Status</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {resellers.map(reseller => (
              <tr key={reseller.id}>
                <td>{reseller.id}</td>
                <td>{reseller.name}</td>
                <td>{reseller.owner}</td>
                <td>
                  <span className={`status-badge ${reseller.status}`}>
                    {reseller.status}
                  </span>
                </td>
                <td>Rp {(reseller.balance || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminResellers;