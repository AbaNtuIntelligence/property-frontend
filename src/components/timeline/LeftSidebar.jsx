import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  MapPinIcon,
  HeartIcon,
  SearchIcon,
  BellIcon,
  SettingsIcon,
  LogoutIcon,
  UserIcon,
  HomeIcon,
  ExploreIcon,
  DashboardIcon
} from '../icons'; // All icons now come from central file
import './Sidebars.css';

export default function LeftSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="left-sidebar">
      {/* Profile Section */}
      <div className="sidebar-card profile-card">
        <div className="profile-card-content">
          <div className="profile-avatar-wrapper">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?background=1877f2&color=fff&bold=true&name=${user?.name || 'User'}`} 
              alt={user?.name || 'User'}
              className="profile-avatar"
            />
            <span className="online-dot"></span>
          </div>
          <div className="profile-info">
            <h4 className="profile-name">{user?.name || 'Guest User'}</h4>
            <p className="profile-location">
              <MapPinIcon />
              {user?.location || 'South Africa'}
            </p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">128</span>
            <span className="stat-label">Stays</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">24</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">4.8</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item active">
            <HomeIcon />
            <span>Home</span>
          </Link>
          <Link to="/timeline" className="nav-item">
            <ExploreIcon />
            <span>Timeline</span>
          </Link>
          <Link to="/properties" className="nav-item">
            <SearchIcon />
            <span>Explore Properties</span>
          </Link>
          <Link to="/wishlist" className="nav-item">
            <HeartIcon />
            <span>Wishlist</span>
            <span className="nav-badge">12</span>
          </Link>
          <Link to="/dashboard" className="nav-item">
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>
          <Link to="/notifications" className="nav-item">
            <BellIcon />
            <span>Notifications</span>
            <span className="nav-badge">3</span>
          </Link>
          <Link to="/settings" className="nav-item">
            <SettingsIcon />
            <span>Settings</span>
          </Link>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Quick Filters */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3>Quick Filters</h3>
          <Link to="/properties" className="reset-link">Reset</Link>
        </div>
        <div className="filter-options">
          <label className="filter-option">
            <input type="checkbox" />
            <span>Pet Friendly</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span>Pool</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span>Backup Power</span>
          </label>
          <label className="filter-option">
            <input type="checkbox" />
            <span>Braai Area</span>
          </label>
        </div>
      </div>

      {/* Load Shedding Alert */}
      <div className="alert-card">
        <div className="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <div className="alert-content">
          <span className="alert-title">Load Shedding</span>
          <span className="alert-message">Stage 2 today 16:00-20:00</span>
        </div>
      </div>
    </div>
  );
}