import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChefCard.css';

export default function ChefDetails() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChefAndMenu = async () => {
      try {
        const [chefRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/chefs/${id}`),
          axios.get(`http://localhost:5000/api/menu/${id}`)
        ]);
        setChef(chefRes.data);
        setMenu(menuRes.data);
      } catch (err) {
        console.error('Error loading chef:', err);
        setError('Failed to load chef details');
      }
    };

    fetchChefAndMenu();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        user_id: 1, // Replace with real logged-in user ID
        chef_id: id,
        booking_date: bookingDate,
        meal_instructions: instructions
      });
      setMessage('✅ Booking successful!');
      setInstructions('');
      setBookingDate('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Booking failed.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!chef) return <p>Loading...</p>;

  return (
    <div className="chef-details-card">
      <h2>{chef.name}</h2>
      <p><strong>Specialty:</strong> {chef.specialty}</p>
      <p><strong>Experience:</strong> {chef.experience_years} years</p>
      <p><strong>Location:</strong> {chef.location}</p>

      <h3>📋 Menu by {chef.name}</h3>
      {menu.length === 0 ? (
        <p>This chef has not added any menu items yet.</p>
      ) : (
        <div className="menu-grid">
          {menu.map(item => (
            <div key={item.id} className="menu-card">
              <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p>£{item.price}</p>
              <p>Category: {item.category}</p>
              <p>{item.available ? '✅ Available' : '❌ Unavailable'}</p>
            </div>
          ))}
        </div>
      )}

      <h3>📅 Book this Chef</h3>
<form onSubmit={handleBooking} className="booking-form-ui">
  <div className="form-group">
    <label htmlFor="date">Booking Date</label>
    <input
      type="date"
      id="date"
      value={bookingDate}
      onChange={e => setBookingDate(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="instructions">Meal Instructions</label>
    <textarea
      id="instructions"
      value={instructions}
      onChange={e => setInstructions(e.target.value)}
      rows="4"
      placeholder="e.g., Vegetarian only, no nuts..."
    />
  </div>

  <button type="submit" className="submit-btn">Confirm Booking</button>
  {message && <p className="form-message">{message}</p>}
</form>
    </div>
  );
}
