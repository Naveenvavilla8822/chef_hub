import React, { useEffect, useState, useContext } from 'react';
import './FavoriteList.css';
import { AuthContext } from '../context/AuthContext';

function FavoriteList() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/favorites/${user.id}`);
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="page-container">
      <h2>⭐ Your Favorite Chefs</h2>
      <ul className="favorite-list">
        {favorites.map((f) => (
          <li key={f.favorite_id}>
            Chef #{f.chef_id} — Added on {new Date(f.saved_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteList;
