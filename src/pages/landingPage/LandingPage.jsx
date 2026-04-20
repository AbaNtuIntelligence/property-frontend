import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timeline from '../timeline/Timeline';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Only redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user.user_type) {
      if (user.user_type === 'owner') {
        navigate('/dashboard/owner');
      } else if (user.user_type === 'seeker') {
        navigate('/dashboard/seeker');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="landing-page">
      <div className="nav-buttons" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
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
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Sign Up
        </button>
      </div>
      
      <Timeline />
    </div>
  );
}