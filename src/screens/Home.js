import React, { useState } from 'react';
import Hero from '../components/Hero';
import ChefCard from '../components/ChefCard';
import './Home.css';

function Home() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const chefs = [
    { name: 'Priya Sharma', cuisine: 'Indian, Vegetarian', rating: 4.9 },
    { name: 'Ali Khan', cuisine: 'Halal, Pakistani', rating: 4.8 },
    { name: 'Jenny Lee', cuisine: 'Korean, Fusion', rating: 4.7 },
    { name: 'Lina Zhang', cuisine: 'Chinese, Vegan', rating: 4.6 },
    { name: 'Carlos Ruiz', cuisine: 'Mexican, Spicy', rating: 4.5 }
  ];

  const cuisines = ['All', 'Indian', 'Pakistani', 'Korean', 'Chinese', 'Mexican'];

  const filteredChefs = selectedCuisine === 'All'
    ? chefs
    : chefs.filter(chef => chef.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()));

  return (
    <div className="home">
      <Hero />

      {/* Cuisine Filter */}
      <div className="filters">
        {cuisines.map(cuisine => (
          <button
            key={cuisine}
            className={`filter-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
            onClick={() => setSelectedCuisine(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Chef Cards */}
      <div className="chefs-container">
        {filteredChefs.map((chef, index) => (
          <ChefCard key={index} {...chef} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>👩‍🍳 Ready to experience home-style meals?</h2>
        <p>Join Chef Hub today and connect with chefs who cook what you love!</p>
        <button className="cta-btn">Get Started</button>
      </div>
    </div>
  );
}

export default Home;
