import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-section brand-section">
          <div className="footer-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Property<span className="logo-highlight">Rental</span></span>
          </div>
          <p className="footer-description">
            Find your perfect home or list your property with South Africa's most trusted rental platform.
          </p>
          <div className="footer-badge">
            <span className="badge">🇿🇆 100% South African</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/properties">Browse Properties</Link></li>
            <li><Link to="/timeline">Timeline</Link></li>
            <li><Link to="/wishlist">Saved Properties</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        {/* For Owners */}
        <div className="footer-section">
          <h3>For Owners</h3>
          <ul>
            <li><Link to="/property/new">List Your Property</Link></li>
            <li><Link to="/owner/resources">Owner Resources</Link></li>
            <li><Link to="/owner/pricing">Pricing</Link></li>
            <li><Link to="/owner/success">Success Stories</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/safety">Safety Tips</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Social Media Row */}
      <div className="footer-social">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook" aria-label="Facebook">
            <span>📘</span> <span className="social-label">Facebook</span>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter" aria-label="Twitter">
            <span>🐦</span> <span className="social-label">Twitter</span>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram" aria-label="Instagram">
            <span>📷</span> <span className="social-label">Instagram</span>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin" aria-label="LinkedIn">
            <span>💼</span> <span className="social-label">LinkedIn</span>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link tiktok" aria-label="TikTok">
            <span>🎵</span> <span className="social-label">TikTok</span>
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} PropertyRental (Pty) Ltd. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/sitemap">Sitemap</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}