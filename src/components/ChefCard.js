import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ChefCard.css';

function ChefCard({ id, name, cuisine, rating }) {
  const handleAddFavorite = async () => {
    try {
      await axios.post('http://localhost:5000/api/favorites', {
        user_id: 1,     // Replace with real logged-in user ID
        chef_id: id
      });
      alert('❤️ Added to favorites!');
    } catch (err) {
      console.error('Failed to add favorite:', err);
      alert('❌ Failed to add to favorites.');
    }
  };

  return (
    <div className="chef-card">
      <div className="chef-card-header">
        <h3>{name}</h3>
        <button className="favorite-btn" onClick={handleAddFavorite}>❤️</button>
      </div>
      <p>{cuisine}</p>
      <p>⭐ {rating} / 5</p>
      <Link to={`/chef/${id}`}>View Details</Link>
    </div>
  );
}

export default ChefCard;
