import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';
import ProductCard from '../../components/ProductCard';

function UserWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      if (response.data && response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat wishlist...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Wishlist Saya</h1>

      {wishlist.length === 0 ? (
        <div className="admin-empty">
          <p>Wishlist kamu masih kosong</p>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            Tambahkan produk favoritmu ke wishlist
          </p>
        </div>
      ) : (
        <div className="admin-grid">
          {wishlist.map(product => (
            <div key={product.id} className="admin-grid-item">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="admin-btn admin-btn-danger"
                style={{ marginTop: 'var(--space-sm)' }}
              >
                Hapus dari Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserWishlist;