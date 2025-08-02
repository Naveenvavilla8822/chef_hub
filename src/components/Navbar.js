import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">🍽️ Chef Hub</Link>
      </div>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        {!user && (
          <>
            <Link to="/" onClick={toggleMenu}>Home</Link>
            <Link to="/about" onClick={toggleMenu}>About Us</Link>
            <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            <Link to="/login" onClick={toggleMenu}>Login</Link>
            <Link to="/register" className="get-started-btn" onClick={toggleMenu}>Get Started</Link>
          </>
        )}

        {user && user.role === 'customer' && (
          <>
            <Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/chefs" onClick={toggleMenu}>Chefs</Link>
            <Link to="/bookings" onClick={toggleMenu}>My Bookings</Link>
            <Link to="/favorites" onClick={toggleMenu}>Favorites</Link>
            <Link to="/profile" onClick={toggleMenu}>Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}

        {user && user.role === 'chef' && (
          <>
            <Link to="/chef_dashboard" onClick={toggleMenu}>Chef Dashboard</Link>
            <Link to="/chef_bookings" onClick={toggleMenu}>My Bookings</Link>
            <Link to="/menu" onClick={toggleMenu}>My Menu</Link>
            <Link to="/profile" onClick={toggleMenu}>Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </div>
    </nav>
  );
}

export default Navbar;
