import React, { useEffect, useState } from 'react';
import './ChefList.css';
import ChefCard from '../components/ChefCard';

function ChefList() {
  const [chefs, setChefs] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisines = ['All', 'Indian', 'Pakistani', 'Korean', 'Chinese', 'Mexican'];

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/chefs');
        const data = await res.json();
        if (Array.isArray(data)) {
          setChefs(data);
        }
      } catch (err) {
        console.error('Failed to load chefs:', err);
      }
    };
    fetchChefs();
  }, []);

  const filteredChefs = selectedCuisine === 'All'
    ? chefs
    : chefs.filter((chef) =>
        chef.specialty?.toLowerCase().includes(selectedCuisine.toLowerCase())
      );

  return (
    <div className="chef-list-page">
      <h2>👨‍🍳 Available Chefs</h2>

      <div className="filters">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            className={`filter-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
            onClick={() => setSelectedCuisine(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>

      <div className="chefs-container">
        {filteredChefs.length > 0 ? (
          filteredChefs.map((chef) => (
            <ChefCard
              key={chef.chef_id}
              id={chef.chef_id}
              name={chef.name}
              cuisine={chef.specialty}
              rating={chef.rating || 4.5}
            />
          ))
        ) : (
          <p>No chefs found.</p>
        )}
      </div>
    </div>
  );
}

export default ChefList;
