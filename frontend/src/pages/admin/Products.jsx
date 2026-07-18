import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'topup', stock: 0, image: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      if (response.data && response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/products', {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock)
      });
      if (response.data && response.data.success) {
        setProducts([...products, response.data.data]);
        setFormData({ name: '', price: '', category: 'topup', stock: 0, image: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat produk...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kelola Produk</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Produk'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Harga</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Kategori</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="topup">Top Up</option>
              <option value="steam">Steam Key</option>
              <option value="giftcard">Gift Card</option>
              <option value="game">Akun Game</option>
              <option value="item">Item Game</option>
              <option value="joki">Jasa Joki</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Stok</label>
            <input
              type="number"
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>URL Gambar</label>
            <input
              type="text"
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-success">Simpan</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>Rp {product.price?.toLocaleString()}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;