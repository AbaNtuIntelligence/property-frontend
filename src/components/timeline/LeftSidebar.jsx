import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LeftSidebar({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Explore', path: '/explore', badge: 'New' },
    { icon: '❤️', label: 'Saved', path: '/saved', badge: '12' },
    { icon: '📋', label: 'My Listings', path: '/my-listings', ownerOnly: true },
    { icon: '📅', label: 'My Bookings', path: '/bookings', seekerOnly: true },
    { icon: '💬', label: 'Messages', path: '/messages', badge: '3' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="left-sidebar">
      {/* User Greeting Card */}
      <div className="sidebar-card user-greeting">
        <div className="greeting-avatar">
          <img src={user?.avatar || '/default-avatar.jpg'} alt="Avatar" />
          {user && <span className="online-dot"></span>}
        </div>
        <h4>Welcome back, {user?.username || 'Guest'}!</h4>
        <p>{user?.user_type === 'owner' ? '🏠 Property Owner' : '🔍 Property Seeker'}</p>
        
        {/* Logout Button - Only show when logged in */}
        {user && (
          <button onClick={handleLogout} className="logout-btn-sidebar">
            🚪 Logout
          </button>
        )}
        
        {!user && (
          <div className="guest-actions">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="sidebar-card">
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            if (item.ownerOnly && user?.user_type !== 'owner') return null;
            if (item.seekerOnly && user?.user_type !== 'seeker') return null;
            
            return (
              <Link key={item.label} to={item.path} className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}