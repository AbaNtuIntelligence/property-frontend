import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside or on link
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.nav-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <span className="logo-icon">🏠</span>
          <span className="logo-text">PropertyRent</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Links - Desktop & Mobile */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/properties" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-label">Browse Properties</span>
          </Link>
          
          <Link 
            to="/timeline" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <span className="nav-icon">📱</span>
            <span className="nav-label">Timeline</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/wishlist" 
                className="nav-link"
                onClick={handleLinkClick}
              >
                <span className="nav-icon">❤️</span>
                <span className="nav-label">Wishlist</span>
                <span className="nav-badge">12</span>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="nav-link"
                onClick={handleLinkClick}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-label">Dashboard</span>
              </Link>
              
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      '👤'
                    )}
                  </span>
                  <span className="user-name">Hi, {user?.name || 'User'}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <span className="btn-icon">🚪</span>
                  <span className="btn-label">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className="login-btn"
              onClick={handleLinkClick}
            >
              <span className="btn-icon">🔑</span>
              <span className="btn-label">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
}