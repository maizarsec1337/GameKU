import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function ResellerStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.resellerStock();
      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      const stockValue = parseInt(newStock);
      if (isNaN(stockValue) || stockValue < 0) {
        alert('Stok harus berupa angka yang valid');
        return;
      }

      await api.updateStock(id, stockValue);
      setProducts(products.map(p => p.id === id ? { ...p, stock: stockValue } : p));
      setUpdatingId(null);
      setNewStock('');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Gagal memperbarui stok');
    }
  };

  const startUpdate = (product) => {
    setUpdatingId(product.id);
    setNewStock(product.stock.toString());
  };

  const cancelUpdate = () => {
    setUpdatingId(null);
    setNewStock('');
  };

  const stockStats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length
  };

  if (loading) {
    return <div className="admin-loading">Memuat stok...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Stok</h1>

      {/* Stats */}
      <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Produk</h3>
            <p className="stat-value">{stockStats.total}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Stok Tersedia</h3>
            <p className="stat-value">{stockStats.inStock}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Stok Menipis</h3>
            <p className="stat-value">{stockStats.lowStock}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Stok Habis</h3>
            <p className="stat-value">{stockStats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      {products.length === 0 ? (
        <div className="admin-empty">
          <p>Belum ada produk</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Stok Saat Ini</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>Rp {product.price?.toLocaleString()}</td>
                  <td>
                    {updatingId === product.id ? (
                      <input
                        type="number"
                        value={newStock}
                        onChange={e => setNewStock(e.target.value)}
                        style={{ width: '100px' }}
                        min="0"
                      />
                    ) : (
                      <strong>{product.stock}</strong>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${product.stock === 0 ? 'cancelled' : product.stock <= 10 ? 'pending' : 'completed'}`}>
                      {product.stock === 0 ? 'Habis' : product.stock <= 10 ? 'Menipis' : 'Tersedia'}
                    </span>
                  </td>
                  <td>
                    {updatingId === product.id ? (
                      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-success"
                          onClick={() => handleUpdateStock(product.id)}
                        >
                          Simpan
                        </button>
                        <button
                          className="admin-btn admin-btn-sm"
                          onClick={cancelUpdate}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        className="admin-btn admin-btn-sm admin-btn-primary"
                        onClick={() => startUpdate(product)}
                      >
                        Ubah
                      </button>
                    )}
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

export default ResellerStock;
