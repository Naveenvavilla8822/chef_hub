import React, { useEffect, useState, useContext } from 'react';
import './BookingList.css';
import { AuthContext } from '../context/AuthContext';

function BookingList() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${user.id}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="page-container">
      <h2>📅 Your Bookings</h2>
      <ul className="booking-list">
        {bookings.map((b) => (
          <li key={b.booking_id}>
            Chef #{b.chef_id} on {new Date(b.booking_date).toLocaleString()}<br />
            <em>{b.meal_instructions}</em> — Status: {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingList;
