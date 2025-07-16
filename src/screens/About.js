import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="section intro">
        <h1>About Chef Hub</h1>
        <p>
          Chef Hub connects food lovers with certified chefs for personalized, home-cooked meals.
          Our platform supports cultural diversity, dietary preferences, and sustainable lifestyles.
        </p>
      </div>

      <div className="section mission">
        <h2>🌍 Our Mission</h2>
        <p>
          We aim to bring homemade food to everyone—especially students, expats, and busy professionals—
          by creating a network of trusted chefs who prepare meals with care, health, and authenticity.
        </p>
      </div>

      <div className="section features">
        <h2>🚀 Why Chef Hub?</h2>
        <ul>
          <li>Certified and skilled chefs near you</li>
          <li>Easy booking and real-time scheduling</li>
          <li>Support for dietary needs and allergies</li>
          <li>Secure and reliable reviews</li>
        </ul>
      </div>

      <div className="section developer">
        <h2>👨‍💻 Meet the Developer</h2>
        <div className="dev-card">
          <img src="https://source.unsplash.com/100x100/?man,developer" alt="Naveen" />
          <div>
            <h3>Naveen</h3>
            <p>Full Stack Developer & UI/UX Enthusiast</p>
            <p>Built Chef Hub to empower cultural food connection and culinary freelancing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
