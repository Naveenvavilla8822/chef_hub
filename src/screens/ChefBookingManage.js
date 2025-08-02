import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ChefBookingManage.css';

export default function ChefBookingManage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chef/bookings/${user.id}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      }
    };

    fetchBookings();
  }, [user]);

  const updateStatus = async (bookingId, status) => {
    try {
      await fetch(`http://localhost:5000/api/chef/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      setBookings(prev =>
        prev.map(b =>
          b.booking_id === bookingId ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="chef-booking-page">
      <h2>📋 Manage Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Instructions</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.booking_id}>
                <td>{b.customer_name}</td>
                <td>{new Date(b.booking_date).toLocaleString()}</td>
                <td>{b.meal_instructions}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === 'pending' && (
                    <>
                      <button className="accept" onClick={() => updateStatus(b.booking_id, 'confirmed')}>Accept</button>
                      <button className="reject" onClick={() => updateStatus(b.booking_id, 'cancelled')}>Reject</button>
                    </>
                  )}
                  {b.status !== 'pending' && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
