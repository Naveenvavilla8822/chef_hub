import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './EditProfile.css';
import { AuthContext } from '../context/AuthContext';

export default function EditProfile() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:5000/api/users/${user.id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error('Failed to load profile:', err));
  }, [user]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, form);
      setMsg('✅ Profile updated!');
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to update profile.');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Phone:
          <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} required />
        </label>
        <label>Address:
          <input type="text" name="address" value={form.address} onChange={handleChange} required />
        </label>
        <button type="submit">Update</button>
        {msg && <p className="form-msg">{msg}</p>}
      </form>
    </div>
  );
}
