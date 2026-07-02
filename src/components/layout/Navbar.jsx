import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

// ===== LOGO COMPONENT =====
const AbantuLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#ff385c"/>
    <path d="M20 6C14.477 6 10 10.477 10 16C10 23 14 28 20 34C26 28 30 23 30 16C30 10.477 25.523 6 20 6Z" fill="white" opacity="0.9"/>
    <path d="M20 11C16.686 11 14 13.686 14 17C14 20.314 16.686 23 20 23C23.314 23 26 20.314 26 17C26 13.686 23.314 11 20 11Z" fill="#ff385c"/>
    <path d="M20 25L16 32H24L20 25Z" fill="white"/>
  </svg>
);

// ===== ICONS =====
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ExploreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const TimelineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user data
  const userName = user?.full_name || user?.username || 'User';
  
  // Get user avatar URL
  useEffect(() => {
    if (user?.avatar) {
      const avatarUrl = user.avatar.startsWith('http') 
        ? user.avatar 
        : `${API_URL}${user.avatar}`;
      setUserAvatar(avatarUrl);
    } else if (user?.username) {
      // Fallback to generated avatar
      setUserAvatar(`https://ui-avatars.com/api/?background=1877f2&color=fff&bold=true&size=100&name=${encodeURIComponent(userName)}`);
    }
  }, [user]);

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
          <AbantuLogo />
          <div className="logo-text-wrapper">
            <span className="logo-text">AbaNtu</span>
            <span className="logo-subtext">Property Rentals</span>
          </div>
        </Link>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/properties" className="nav-link" onClick={handleLinkClick}>
            <ExploreIcon />
            <span>Explore</span>
          </Link>
          
          <Link to="/timeline" className="nav-link" onClick={handleLinkClick}>
            <TimelineIcon />
            <span>Timeline</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="nav-link" onClick={handleLinkClick}>
                <HeartIcon />
                <span>Wishlist</span>
                <span className="nav-badge">0</span>
              </Link>
              
              <Link to="/dashboard" className="nav-link" onClick={handleLinkClick}>
                <DashboardIcon />
                <span>Dashboard</span>
              </Link>
              
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-avatar">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} />
                    ) : (
                      <UserIcon />
                    )}
                  </span>
                  <span className="user-name">Hi, {userName}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-btn" onClick={handleLinkClick}>
              <UserIcon />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
}