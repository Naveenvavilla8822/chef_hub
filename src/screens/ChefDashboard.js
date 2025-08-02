import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ChefDashboard.css';

export default function ChefDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalBookings: 0 });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get booking stats
        const statsRes = await fetch(`http://localhost:5000/api/chef/stats/${user.id}`);
        const statsData = await statsRes.json();
        setStats(statsData);

        // Get recent bookings
        const bookingsRes = await fetch(`http://localhost:5000/api/chef/bookings/${user.id}`);
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error loading chef dashboard:', err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="chef-dashboard">
      <h2>👨‍🍳 Welcome back, {user?.name}</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>My Menu</h3>
          <Link to="/menu" className="menu-link">Manage Menu</Link>
        </div>
      </div>

      <h3 className="section-heading">📋 Recent Bookings</h3>
      {bookings.length === 0 ? (
        <p>No recent bookings.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Instructions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.booking_id}>
                <td>{b.customer_name}</td>
                <td>{new Date(b.booking_date).toLocaleString()}</td>
                <td>{b.meal_instructions}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
