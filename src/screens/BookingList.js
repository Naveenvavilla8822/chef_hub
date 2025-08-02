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
    <div className="booking-page">
      <h2>📅 Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((b) => (
            <div key={b.booking_id} className="booking-card">
              <div className="booking-header">
                <h3>{b.chef_name}</h3>
                <span className={`status ${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
              <p><strong>Specialty:</strong> {b.specialty}</p>
              <p><strong>Date:</strong> {new Date(b.booking_date).toLocaleString()}</p>
              <p><strong>Instructions:</strong> {b.meal_instructions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;
