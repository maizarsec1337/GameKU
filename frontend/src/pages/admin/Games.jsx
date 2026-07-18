import React, { useState, useEffect } from 'react';
import api from '../../services/authAPI';

function AdminGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/admin/games');
      if (response.data && response.data.success) {
        setGames(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Memuat game...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Game</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.name}</td>
                <td>Rp {game.price?.toLocaleString()}</td>
                <td>{game.stock}</td>
                <td>
                  <span className={`status-badge ${game.status}`}>
                    {game.status}
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

export default AdminGames;