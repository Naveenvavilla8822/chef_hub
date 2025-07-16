import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">🍽️ Chef Hub</Link>
      </div>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/about" onClick={toggleMenu}>About Us</Link>
        <Link to="/contact" onClick={toggleMenu}>Contact Us</Link>
        <Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link>
        <Link to="/get-started" className="get-started-btn" onClick={toggleMenu}>Get Started</Link>
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
