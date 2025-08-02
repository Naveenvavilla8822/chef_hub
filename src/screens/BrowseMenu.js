import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MenuManager.css'; // Reuse same styles

export default function BrowseMenu() {
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const query = new URLSearchParams();
        if (category) query.append('category', category);
        if (availableOnly) query.append('available', true);

        const res = await axios.get(`http://localhost:5000/api/menus?${query}`);
        setMenus(res.data);
      } catch (err) {
        console.error('Failed to load public menu:', err);
      }
    };

    fetchMenus();
  }, [category, availableOnly]);

  return (
    <div className="menu-page">
      <h2>📖 Browse Menus</h2>

      <div className="menu-form" style={{ marginBottom: '30px' }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Starter">Starter</option>
          <option value="Main">Main</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={e => setAvailableOnly(e.target.checked)}
          />
          Show Available Only
        </label>
      </div>

      {menus.length === 0 ? (
        <p>No matching items found.</p>
      ) : (
        <div className="menu-grid">
          {menus.map(item => (
            <div key={item.id} className="menu-card">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>£{item.price}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Chef:</strong> {item.chef_name}</p>
              <p>{item.available ? '✅ Available' : '❌ Unavailable'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
