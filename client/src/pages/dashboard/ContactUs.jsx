// src/pages/dashboard/ContactUs.jsx
import React from 'react';
import './ContactUs.css';
const ContactUs = () => {
  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <p>If you have any questions or need support, feel free to reach out to us!</p>

      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your Name" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Your Email" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" placeholder="Your Message" required></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
