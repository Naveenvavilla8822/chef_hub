import React, { useContext, useEffect, useState } from 'react';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bookings: 0,
    favorites: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`http://localhost:5000/api/dashboard/${user.id}`);
        const data = await res.json();
        if (res.ok) setStats(data);
        else console.error('Error loading dashboard stats:', data.msg);
      } catch (err) {
        console.error('Server error:', err);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.name || 'Guest'}! 👋</h1>

      <div className="dashboard-widgets">
        <div className="widget">
          <h2>📅 Upcoming Bookings</h2>
          <p>{stats.bookings} bookings this week</p>
        </div>
        <div className="widget">
          <h2>⭐ Favorite Chefs</h2>
          <p>{stats.favorites} saved chefs</p>
        </div>
        <div className="widget">
          <h2>📂 Past Orders</h2>
          <p>{stats.orders} meals ordered</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="dashboard-btn" onClick={() => navigate('/book')}>Book a Chef</button>
        <button className="dashboard-btn" onClick={() => navigate('/menus')}>Browse Menus</button>
        <button className="dashboard-btn" onClick={() => navigate('/profile')}>Edit Profile</button>
      </div>
    </div>
  );
}

export default Dashboard;
