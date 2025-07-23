import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import About from './screens/About';
import Contact from './screens/Contact';
import './App.css';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import BookChef from './screens/BookChef';
import ChefList from './screens/ChefList';
import BookingList from './screens/BookingList';
import FavoriteList from './screens/FavoriteList';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<BookChef />} />
          <Route path="/chefs" element={<ChefList />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/favorites" element={<FavoriteList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
