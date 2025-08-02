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
import ChefDetails from './components/ChefDetails';
import EditProfile from './screens/EditProfile';
import ChefDashboard from './screens/ChefDashboard';
import ChefBookingManage from './screens/ChefBookingManage';
import MenuManager from './screens/MenuManager';
import BrowseMenu from './screens/BrowseMenu';

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
          <Route path="/chef/:id" element={<ChefDetails />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/chef_dashboard" element={<ChefDashboard />} />
          <Route path="/chef_bookings" element={<ChefBookingManage />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/menus" element={<BrowseMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
