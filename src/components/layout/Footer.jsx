import React from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon
} from '../icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About</h3>
          <Link to="/about">How it works</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/press">Press</Link>
        </div>

        <div className="footer-section">
          <h3>Community</h3>
          <Link to="/diversity">Diversity & Belonging</Link>
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/sustainability">Sustainability</Link>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <Link to="/help">Help Center</Link>
          <Link to="/safety">Safety information</Link>
          <Link to="/contact">Contact us</Link>
        </div>

        <div className="footer-section">
          <h3>Follow us</h3>
          <div className="social-links">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Facebook"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link twitter"
              aria-label="Twitter"
            >
              <TwitterIcon />
              <span>Twitter</span>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Instagram"
            >
              <InstagramIcon />
              <span>Instagram</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link tiktok"
              aria-label="TikTok"
            >
              <TikTokIcon />
              <span>TikTok</span>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link youtube"
              aria-label="YouTube"
            >
              <YouTubeIcon />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 PropertyRent. All rights reserved.</p>
      </div>
    </footer>
  );
}