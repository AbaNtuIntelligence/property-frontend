import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  MapPinIcon,
  HeartIcon,
  HomeIcon,
  ExploreIcon,
  DashboardIcon,
  SettingsIcon,
  LogoutIcon,
  BellIcon
} from '../icons';
import './Sidebars.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function LeftSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user data with fallbacks
  const userName = user?.full_name || user?.username || 'Guest User';
  const userLocation = user?.location || 'South Africa';
  
  // ===== IMAGE LOGIC =====
  const getAvatarUrl = () => {
    // If user has avatar
    if (user?.avatar) {
      // If avatar is a full URL (starts with http)
      if (user.avatar.startsWith('http')) {
        return user.avatar;
      }
      // If avatar is a relative path, prepend API_URL
      return `${API_URL}${user.avatar}`;
    }
    
    // If user has profile_picture (alternative field)
    if (user?.profile_picture) {
      if (user.profile_picture.startsWith('http')) {
        return user.profile_picture;
      }
      return `${API_URL}${user.profile_picture}`;
    }
    
    // Fallback: Generate avatar from name
    return `https://ui-avatars.com/api/?background=1877f2&color=fff&bold=true&size=100&name=${encodeURIComponent(userName)}`;
  };

  const userAvatar = getAvatarUrl();

  // SVG Icons (same as before)
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  );

  const ExploreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );

  const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );

  return (
    <div className="left-sidebar">
      {/* Profile Card */}
      <div className="sidebar-card profile-card">
        <div className="profile-card-content">
          <div className="profile-avatar-wrapper">
            <img 
              src={userAvatar}
              alt={userName}
              className="profile-avatar"
              onError={(e) => {
                // If image fails to load, fallback to generated avatar
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?background=1877f2&color=fff&bold=true&size=100&name=${encodeURIComponent(userName)}`;
              }}
            />
            <span className="online-dot"></span>
          </div>
          <div className="profile-info">
            <h4 className="profile-name">{userName}</h4>
            <p className="profile-location">
              <MapPinIcon />
              {userLocation}
            </p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Stays</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">0</span>
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
          </Link>
          <Link to="/dashboard" className="nav-item">
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>
          <Link to="/notifications" className="nav-item">
            <BellIcon />
            <span>Notifications</span>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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