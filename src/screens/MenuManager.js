import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './MenuManager.css';
import { AuthContext } from '../context/AuthContext';

export default function MenuManager() {
  const { user } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image: null
  });

  useEffect(() => {
    if (!user) return;

    const fetchMenu = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/menu/${user.id}`);
        setMenu(res.data);
      } catch (err) {
        console.error('Failed to load menu:', err);
      }
    };

    fetchMenu();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('chef_id', user.id);
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('available', form.available);
    formData.append('image', form.image);

    try {
      await axios.post('http://localhost:5000/api/menu/add', formData);
      window.location.reload();
    } catch (err) {
      console.error('Menu upload failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      setMenu(menu.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete menu item:', err);
    }
  };

  if (!user) return <p className="menu-page">⚠️ Please log in as a chef to manage your menu.</p>;

  return (
    <div className="menu-page">
      <h2>🍽️ Manage Your Menu</h2>

      <form onSubmit={handleSubmit} className="menu-form">
        <input
          type="text"
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
        />

        <select
          onChange={e => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          <option value="Starter">Starter</option>
          <option value="Main">Main</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({ ...form, image: e.target.files[0] })}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={form.available}
            onChange={e => setForm({ ...form, available: e.target.checked })}
          />
          Available
        </label>

        <button type="submit">Add Item</button>
      </form>

      {menu.length === 0 ? (
        <p>No menu items yet. Add your first dish!</p>
      ) : (
        <div className="menu-grid">
          {menu.map(item => (
            <div key={item.id} className="menu-card">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>£{item.price}</p>
              <p>Category: {item.category}</p>
              <p>{item.available ? '✅ Available' : '❌ Unavailable'}</p>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
