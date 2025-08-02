import React, { useEffect, useState, useContext } from 'react';
import './FavoriteList.css';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
    <div className="favorite-page">
      <h2>❤️ Your Favorite Chefs</h2>
      {favorites.length === 0 ? (
        <p>No favorite chefs yet.</p>
      ) : (
        <div className="favorite-grid">
          {favorites.map((f) => (
            <div key={f.favorite_id} className="favorite-card">
              <h3>{f.chef_name}</h3>
              <p><strong>Specialty:</strong> {f.specialty}</p>
              <p><strong>Saved On:</strong> {new Date(f.saved_at).toLocaleDateString()}</p>
              <Link to={`/chef/${f.chef_id}`} className="view-link">View Details</Link>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteList;
