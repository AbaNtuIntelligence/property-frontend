// RightSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Sidebars.css";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function RightSidebar({ user }) {
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [suggestedHosts, setSuggestedHosts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);



// Inside RightSidebar component
const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate('/');
};

// Add logout button somewhere in the sidebar
<button onClick={handleLogout} className="logout-btn-sidebar">
  🚪 Logout
</button>

  // Mock trending properties (replace with API data)
  useEffect(() => {
    setTrendingProperties([
      { id: 1, title: 'Luxury Beach House', location: 'Cape Town', price: 3500, image: '/beach-house.jpg', views: 1245 },
      { id: 2, title: 'Downtown Loft', location: 'Johannesburg', price: 2200, image: '/loft.jpg', views: 892 },
      { id: 3, title: 'Family Home', location: 'Durban', price: 1800, image: '/family-home.jpg', views: 756 },
    ]);

    setSuggestedHosts([
      { id: 1, name: 'Sarah Johnson', type: 'Superhost', properties: 12, avatar: '/sarah.jpg', rating: 4.9 },
      { id: 2, name: 'Mike Chen', type: 'Professional Host', properties: 8, avatar: '/mike.jpg', rating: 4.8 },
      { id: 3, name: 'Emma Williams', type: 'New Host', properties: 3, avatar: '/emma.jpg', rating: 5.0 },
    ]);

    setRecentActivity([
      { id: 1, user: 'John D.', action: 'booked', property: 'Beachfront Villa', time: '5 min ago' },
      { id: 2, user: 'Lisa M.', action: 'reviewed', property: 'City Apartment', rating: 5, time: '1 hour ago' },
      { id: 3, user: 'David K.', action: 'listed', property: 'Cozy Studio', time: '3 hours ago' },
    ]);
  }, []);

  return (
    <div className="right-sidebar">
      {/* User Stats Card */}
      {user && (
        <div className="sidebar-card user-stats">
          <h3>📊 Your Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{user.user_type === 'owner' ? '5' : '12'}</span>
              <span className="stat-label">{user.user_type === 'owner' ? 'Listings' : 'Bookings'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.user_type === 'owner' ? '4.9' : '8'}</span>
              <span className="stat-label">{user.user_type === 'owner' ? 'Rating' : 'Saved'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.user_type === 'owner' ? '$12.5k' : '24'}</span>
              <span className="stat-label">{user.user_type === 'owner' ? 'Earnings' : 'Reviews'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Trending Now */}
      <div className="sidebar-card trending-card">
        <div className="sidebar-header">
          <h3>🔥 Trending Now</h3>
          <Link to="/trending" className="see-all">See All</Link>
        </div>
        <div className="trending-list">
          {trendingProperties.map((property, index) => (
            <Link key={property.id} to={`/property/${property.id}`} className="trending-item">
              <span className="trending-rank">#{index + 1}</span>
              <div className="trending-info">
                <h4>{property.title}</h4>
                <p>{property.location}</p>
                <div className="trending-meta">
                  <span className="price">${property.price}/mo</span>
                  <span className="views">👁️ {property.views}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Hosts / Suggested to Follow */}
      <div className="sidebar-card hosts-card">
        <div className="sidebar-header">
          <h3>⭐ Top Hosts</h3>
          <Link to="/hosts" className="see-all">View All</Link>
        </div>
        <div className="hosts-list">
          {suggestedHosts.map((host) => (
            <div key={host.id} className="host-item">
              <img src={host.avatar} alt={host.name} className="host-avatar" />
              <div className="host-info">
                <h4>{host.name}</h4>
                <p>{host.type}</p>
                <div className="host-stats">
                  <span>🏠 {host.properties} properties</span>
                  <span>⭐ {host.rating}</span>
                </div>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="sidebar-card activity-card">
        <div className="sidebar-header">
          <h3>🔄 Recent Activity</h3>
          <Link to="/activity" className="see-all">History</Link>
        </div>
        <div className="activity-feed">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.action === 'booked' && '📅'}
                {activity.action === 'reviewed' && '⭐'}
                {activity.action === 'listed' && '🏠'}
              </div>
              <div className="activity-details">
                <p>
                  <strong>{activity.user}</strong> {activity.action}{' '}
                  <Link to={`/property/${activity.propertyId}`}>{activity.property}</Link>
                  {activity.rating && ` (${activity.rating}⭐)`}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal / Local Tips */}
      <div className="sidebar-card tips-card">
        <div className="tips-header">
          <span className="tips-icon">💡</span>
          <h3>Rental Tips</h3>
        </div>
        <div className="tips-list">
          <div className="tip-item">
            <p>📸 Professional photos increase bookings by 40%</p>
          </div>
          <div className="tip-item">
            <p>✅ Respond to inquiries within 1 hour for better ranking</p>
          </div>
          <div className="tip-item">
            <p>🏷️ Lower your price by 10% for quicker bookings</p>
          </div>
        </div>
      </div>

      {/* Ad Space / Promoted */}
      <div className="sidebar-card ad-card">
        <div className="ad-badge">Sponsored</div>
        <div className="ad-content">
          <span className="ad-icon">🏢</span>
          <h4>List your property for free</h4>
          <p>Reach thousands of potential tenants</p>
          <button className="ad-btn">Become a Host →</button>
        </div>
      </div>

      {/* Community Poll / Engagement */}
      <div className="sidebar-card poll-card">
        <h3>🗳️ Community Poll</h3>
        <p>What's most important when renting?</p>
        <div className="poll-options">
          <label className="poll-option">
            <input type="radio" name="poll" /> Price
          </label>
          <label className="poll-option">
            <input type="radio" name="poll" /> Location
          </label>
          <label className="poll-option">
            <input type="radio" name="poll" /> Amenities
          </label>
          <label className="poll-option">
            <input type="radio" name="poll" /> Pet friendly
          </label>
        </div>
        <button className="vote-btn">Vote Now</button>
        <p className="poll-results">1,234 votes • See results</p>
      </div>

      {/* Social Links */}
      <div className="sidebar-card social-links">
        <h3>📱 Connect With Us</h3>
        <div className="social-icons">
          <a href="#" className="social-icon">📘</a>
          <a href="#" className="social-icon">📷</a>
          <a href="#" className="social-icon">🐦</a>
          <a href="#" className="social-icon">🎵</a>
          <a href="#" className="social-icon">💼</a>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/help">Help</Link>
        </div>
        <p className="copyright">© 2024 PropertyRental</p>
      </div>
    </div>
  );
}