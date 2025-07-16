import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  // Dummy user and dashboard stats
  const [user, setUser] = useState({ name: "Naveen" });
  const [stats, setStats] = useState({
    bookings: 3,
    favorites: 5,
    orders: 12
  });

  // Simulate data load
  useEffect(() => {
    // Normally you'd fetch data from backend here
    console.log("Loaded dashboard data for", user.name);
  }, [user]);

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.name}! 👋</h1>

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
        <button className="dashboard-btn">Book a Chef</button>
        <button className="dashboard-btn">Browse Menus</button>
        <button className="dashboard-btn">Edit Profile</button>
      </div>
    </div>
  );
}

export default Dashboard;
