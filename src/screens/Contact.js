import React from 'react';
import './Contact.css';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-info">
        <h2>📞 Get in Touch</h2>
        <p>Email: <a href="mailto:support@chefhub.com">support@chefhub.com</a></p>
        <p>Phone: <a href="tel:+18005552665">+1-800-555-COOK</a></p>
        <p>Location: Bengaluru, India</p>
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
        </div>
      </div>

      <div className="contact-form">
        <h2>📝 Contact Form</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="5" placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="contact-map">
        <h2>📍 Our Location</h2>
        <iframe
          title="Chef Hub Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.479646970872!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c3589df7%3A0x4c1a7a1e8ec9e1d2!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1656777600000"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "10px" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
