import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    role: 'customer',
    cuisine_specialties: '',
    certifications: '',
    availability_schedule: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number required';
    if (!formData.address) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.msg || 'Registration failed');
      } else {
        setMessage('✅ Account created successfully!');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>📝 Register for Chef Hub</h2>
        {message && <div className="auth-msg">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="auth-error">{errors.name}</span>}

          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="auth-error">{errors.email}</span>}

          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="auth-error">{errors.password}</span>}

          <input name="phone_number" type="text" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
          {errors.phone_number && <span className="auth-error">{errors.phone_number}</span>}

          <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} />
          {errors.address && <span className="auth-error">{errors.address}</span>}

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="chef">Chef</option>
          </select>

          {/* Extra fields for chef only */}
          {formData.role === 'chef' && (
            <>
              <input
                name="cuisine_specialties"
                type="text"
                placeholder="Cuisine Specialties (e.g. Indian, Italian)"
                value={formData.cuisine_specialties}
                onChange={handleChange}
              />

              <input
                name="certifications"
                type="text"
                placeholder="Certifications (e.g. FSSAI Certified)"
                value={formData.certifications}
                onChange={handleChange}
              />

              <input
                name="availability_schedule"
                type="text"
                placeholder="Availability Schedule (e.g. Mon–Fri 6–10pm)"
                value={formData.availability_schedule}
                onChange={handleChange}
              />
            </>
          )}

          <button type="submit">Create Account</button>
        </form>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

export default Register;
