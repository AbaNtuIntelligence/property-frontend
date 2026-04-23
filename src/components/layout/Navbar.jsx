import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', active: location.pathname === '/' },
    { path: '/timeline', icon: '📱', label: 'Timeline', active: location.pathname === '/timeline', auth: true },
    { path: '/properties', icon: '🔍', label: 'Explore', active: location.pathname === '/properties' },
    { path: '/wishlist', icon: '❤️', label: 'Saved', active: location.pathname === '/wishlist', auth: true, badge: 12 },
    { path: '/dashboard', icon: '📊', label: 'Dashboard', active: location.pathname === '/dashboard', auth: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.auth || (item.auth && isAuthenticated));

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-icon">🏠</div>
          <div className="logo-text">
            Property<span className="logo-highlight">Rent</span>
          </div>
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
          {searchQuery && (
            <button type="button" className="search-clear" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </form>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${item.active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-trigger">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    user?.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="user-name">{user?.username?.split(' ')[0] || 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              <div className="user-dropdown">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <span>👤</span> Profile
                </Link>
                <Link to="/my-listings" onClick={() => setIsMenuOpen(false)}>
                  <span>🏠</span> My Listings
                </Link>
                <Link to="/messages" onClick={() => setIsMenuOpen(false)}>
                  <span>💬</span> Messages
                  {messages > 0 && <span className="dropdown-badge">{messages}</span>}
                </Link>
                <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                  <span>🔔</span> Notifications
                  {notifications > 0 && <span className="dropdown-badge">{notifications}</span>}
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
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Log in</Link>
              <Link to="/register" className="btn-signup">Sign up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="menu-icon">
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </div>
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
        
        {/* Mobile Navigation Items */}
        <div className="mobile-nav-items">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
              {item.badge && <span className="mobile-nav-badge">{item.badge}</span>}
            </Link>
          ))}
        </div>

        {/* User Section (Mobile) */}
        {isAuthenticated ? (
          <div className="mobile-user-section">
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="mobile-user-name">{user?.username}</div>
                <div className="mobile-user-email">{user?.email}</div>
              </div>
            </div>
            <Link to="/profile" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span>👤</span> Profile
            </Link>
            <Link to="/my-listings" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span>🏠</span> My Listings
            </Link>
            <Link to="/messages" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span>💬</span> Messages
              {messages > 0 && <span className="mobile-badge">{messages}</span>}
            </Link>
            <Link to="/notifications" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span>🔔</span> Notifications
              {notifications > 0 && <span className="mobile-badge">{notifications}</span>}
            </Link>
            <Link to="/settings" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span>⚙️</span> Settings
            </Link>
            <button onClick={handleLogout} className="mobile-logout-btn">
              <span>🚪</span> Logout
            </button>
          </div>
        ) : (
          <div className="mobile-auth-buttons">
            <Link to="/login" className="mobile-login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
            <Link to="/register" className="mobile-signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}