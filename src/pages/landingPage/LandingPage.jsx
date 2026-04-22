import React from 'react';
import { useNavigate } from 'react-router-dom';
import Timeline from '../timeline/Timeline';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <div className="nav-bar" style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '15px 30px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          🏠 PropertyRental
        </div>
        
        <div className="nav-buttons" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 20px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                style={{
                  padding: '8px 20px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span style={{ color: '#333' }}>
                Welcome, <strong>{user.username}</strong> ({user.user_type === 'owner' ? 'Owner' : 'Seeker'})
              </span>
              <button 
                onClick={() => navigate(user.user_type === 'owner' ? '/dashboard/owner' : '/dashboard/seeker')}
                style={{
                  padding: '8px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 20px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Timeline Component */}
      <div style={{ marginTop: '70px' }}>
        <Timeline />
      </div>
    </div>
  );
}