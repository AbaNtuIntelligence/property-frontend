import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '80px 20px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>You are logged in as a {user?.user_type === 'owner' ? 'Property Owner' : 'Property Seeker'}</p>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
          <button onClick={() => navigate('/timeline')} style={{ padding: '12px 24px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px' }}>
            🔍 Explore Properties
          </button>
          {user?.user_type === 'owner' && (
            <button onClick={() => navigate('/property/new')} style={{ padding: '12px 24px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}>
              ➕ List New Property
            </button>
          )}
          <button onClick={handleLogout} style={{ padding: '12px 24px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px' }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}