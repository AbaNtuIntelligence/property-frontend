import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (location.state?.selectedProperty) {
      // Fetch and display the selected property details
      setSelectedProperty(location.state.selectedProperty);
    }
  }, [location]);

  const handleListProperty = () => {
    navigate('/create-property');
  };

  const handleExploreProperties = () => {
    navigate('/timeline');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard, {user?.displayName || user?.email?.split('@')[0]}! 👋</h1>
        <div className="dashboard-actions">
          <button onClick={handleExploreProperties} className="btn-explore">
            🔍 Explore Properties
          </button>
          <button onClick={handleListProperty} className="btn-list">
            📝 List Property
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {selectedProperty && (
          <div className="selected-property">
            <h2>Selected Property Details</h2>
            <p>Property ID: {selectedProperty}</p>
          </div>
        )}
        
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={handleExploreProperties}>
            <div className="card-icon">🏠</div>
            <h3>Explore Properties</h3>
            <p>Browse through thousands of available properties</p>
            <button className="card-btn">Start Exploring →</button>
          </div>
          
          <div className="dashboard-card" onClick={handleListProperty}>
            <div className="card-icon">📝</div>
            <h3>List Your Property</h3>
            <p>Reach thousands of potential tenants</p>
            <button className="card-btn">List Now →</button>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>My Properties</h3>
            <p>View and manage your listed properties</p>
            <button className="card-btn">Manage →</button>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">💬</div>
            <h3>Messages</h3>
            <p>Communicate with potential renters</p>
            <button className="card-btn">View Messages →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;