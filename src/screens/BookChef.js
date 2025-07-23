import React, { useState, useContext } from 'react';
import './BookChef.css';
import { AuthContext } from '../context/AuthContext';

function BookChef() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    chef_id: '',
    date: '',
    instructions: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          chef_id: form.chef_id,
          booking_date: form.date,
          meal_instructions: form.instructions
        })
      });
      const data = await res.json();
      if (res.ok) setMessage('Chef booked successfully!');
      else setMessage(data.msg || 'Booking failed');
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="book-chef-container">
      <h2>📅 Book a Chef</h2>
      {message && <div className="booking-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input type="number" name="chef_id" placeholder="Chef ID" value={form.chef_id} onChange={handleChange} required />
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
        <textarea name="instructions" placeholder="Meal instructions" value={form.instructions} onChange={handleChange} />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default BookChef;
