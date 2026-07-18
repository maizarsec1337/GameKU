import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function ResellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: 0,
    category_id: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.resellerProducts();
      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
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
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };

      let response;
      if (editingProduct) {
        response = await api.updateProduct(editingProduct.id, payload);
      } else {
        response = await api.createProduct(payload);
      }

      if (response.data && response.data.success) {
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data.data : p));
        } else {
          setProducts([...products, response.data.data]);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan produk');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price?.toString() || '',
      stock: product.stock || 0,
      category_id: product.category_id?.toString() || '',
      description: product.description || '',
      image: product.image || product.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: 0, category_id: '', description: '', image: '' });
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
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
              <label>Kategori</label>
              <input
                type="text"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                placeholder="ID Kategori"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="admin-form-group">
              <label>Harga (Rp)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
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
          </div>

          <div className="admin-form-group">
            <label>Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows="3"
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

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button type="submit" className="admin-btn admin-btn-success">Simpan</button>
            <button type="button" className="admin-btn" onClick={resetForm}>Batal</button>
          </div>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
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
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status || 'aktif'}`}>
                    {product.status || (product.stock > 0 ? 'aktif' : 'habis')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(product.id)}>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResellerProducts;
