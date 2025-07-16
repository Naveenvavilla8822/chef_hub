import React from 'react';
import './ChefCard.css';

function ChefCard({ name, cuisine, rating }) {
  return (
    <div className="chef-card">
      <h3>{name}</h3>
      <p>{cuisine}</p>
      <p>⭐ {rating} / 5</p>
    </div>
  );
}

export default ChefCard;
