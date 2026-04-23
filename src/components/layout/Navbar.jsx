import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-icon">🏠</span>
          <span className="logo-text">Property<span className="logo-highlight">Rental</span></span>
        </Link>

        {/* Search Bar - Desktop */}
        <form className="search-bar" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search properties, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/explore" className="nav-link">
            <span className="nav-icon">🔍</span>
            <span>Explore</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/messages" className="nav-link">
                <span className="nav-icon">💬</span>
                <span>Messages</span>
                <span className="notification-badge">3</span>
              </Link>
              <Link to="/notifications" className="nav-link">
                <span className="nav-icon">🔔</span>
                <span>Notifications</span>
              </Link>
              
              {/* User Menu Dropdown */}
              <div className="user-menu">
                <button className="user-menu-btn">
                  <img 
                    src={user?.avatar || 'https://ui-avatars.com/api/?background=007bff&color=fff&name=' + (user?.username || 'User')} 
                    alt="Avatar"
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.username}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <span>👤</span> Profile
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <span>📊</span> Dashboard
                  </Link>
                  {user?.user_type === 'owner' && (
                    <Link to="/my-listings" onClick={() => setIsMenuOpen(false)}>
                      <span>🏠</span> My Listings
                    </Link>
                  )}
                  <Link to="/saved" onClick={() => setIsMenuOpen(false)}>
                    <span>❤️</span> Saved
                  </Link>
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                    <span>⚙️</span> Settings
                  </Link>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-logout">
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        {/* Mobile Search */}
        <form className="mobile-search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <span>🏠</span> Home
        </Link>
        <Link to="/explore" onClick={() => setIsMenuOpen(false)}>
          <span>🔍</span> Explore
        </Link>
        
        {user ? (
          <>
            <Link to="/messages" onClick={() => setIsMenuOpen(false)}>
              <span>💬</span> Messages
              <span className="mobile-badge">3</span>
            </Link>
            <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
              <span>🔔</span> Notifications
            </Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <span>👤</span> Profile
            </Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <span>📊</span> Dashboard
            </Link>
            {user?.user_type === 'owner' && (
              <Link to="/my-listings" onClick={() => setIsMenuOpen(false)}>
                <span>🏠</span> My Listings
              </Link>
            )}
            <hr />
            <button onClick={handleLogout} className="mobile-logout">
              <span>🚪</span> Logout
            </button>
          </>
        ) : (
          <div className="mobile-auth">
            <Link to="/login" className="mobile-login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="mobile-signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}