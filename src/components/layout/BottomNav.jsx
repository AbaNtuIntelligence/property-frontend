import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', public: true },
    { path: '/timeline', icon: '🔍', label: 'Explore', auth: true },
    { path: '/dashboard', icon: '📊', label: 'Dashboard', auth: true },
    { path: '/profile', icon: '👤', label: 'Profile', auth: true },
  ];

  const visibleItems = navItems.filter(item => 
    item.public === true || (item.auth && isAuthenticated)
  );

  return (
    <div className="mobile-bottom-nav">
      {visibleItems.map(item => (
        <button
          key={item.path}
          className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}