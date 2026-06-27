import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebars.css';

const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const TrendingData = [
  { id: 1, title: 'Clifton Beach Villa', location: 'Cape Town', price: 'R8,500', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=60&h=60&fit=crop' },
  { id: 2, title: 'Franschhoek Estate', location: 'Winelands', price: 'R12,000', image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=60&h=60&fit=crop' },
  { id: 3, title: 'Kruger Bush Lodge', location: 'Mpumalanga', price: 'R15,000', image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=60&h=60&fit=crop' },
  { id: 4, title: 'Umhlanga Penthouse', location: 'Durban', price: 'R5,500', image: 'https://images.unsplash.com/photo-1590114518871-9b5f5a6f7b5a?w=60&h=60&fit=crop' },
  { id: 5, title: 'Plettenberg Bay', location: 'Garden Route', price: 'R7,200', image: 'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=60&h=60&fit=crop' },
];

const SuggestedHosts = [
  { id: 1, name: 'Thando Ndlovu', location: 'Cape Town', avatar: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=40&h=40&fit=crop', properties: 8 },
  { id: 2, name: 'Johan van der Merwe', location: 'Franschhoek', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop', properties: 5 },
  { id: 3, name: 'Priya Naidoo', location: 'Durban', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop', properties: 4 },
  { id: 4, name: 'Sipho Dlamini', location: 'Mbombela', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop', properties: 3 },
];

const Destinations = [
  { city: 'Cape Town', flag: '🇿🇦', count: 345 },
  { city: 'Franschhoek', flag: '🇿🇦', count: 89 },
  { city: 'Durban', flag: '🇿🇦', count: 234 },
  { city: 'Kruger Park', flag: '🇿🇦', count: 67 },
  { city: 'Plettenberg Bay', flag: '🇿🇦', count: 123 },
  { city: 'Johannesburg', flag: '🇿🇦', count: 456 },
];

export default function RightSidebar() {
  return (
    <div className="right-sidebar">
      {/* Trending Properties */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3>
            <TrendingIcon />
            Trending in SA
          </h3>
          <Link to="/trending" className="see-all">View All</Link>
        </div>
        <div className="trending-list">
          {TrendingData.map((item, index) => (
            <Link key={item.id} to={`/property/${item.id}`} className="trending-item">
              <span className="trending-rank">#{index + 1}</span>
              <img src={item.image} alt={item.title} className="trending-image" />
              <div className="trending-info">
                <h4>{item.title}</h4>
                <p>{item.location}</p>
                <span className="trending-price">{item.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Hosts */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3>
            <StarIcon />
            Top Hosts
          </h3>
          <Link to="/hosts" className="see-all">See All</Link>
        </div>
        <div className="suggested-list">
          {SuggestedHosts.map((host) => (
            <div key={host.id} className="suggested-item">
              <img src={host.avatar} alt={host.name} className="suggested-avatar" />
              <div className="suggested-info">
                <h4>{host.name}</h4>
                <p>{host.location}</p>
                {host.properties > 5 && (
                  <span className="superhost-badge">Superhost</span>
                )}
              </div>
              <button className="follow-btn">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offer Ad */}
      <div className="sidebar-card ad-card">
        <div className="ad-badge">Sponsored</div>
        <div className="ad-content">
          <span className="ad-label">Special Offer</span>
          <h4>List your property</h4>
          <p>Reach millions of travelers in 2026</p>
          <button className="ad-button">Become a Host →</button>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3>
            <GlobeIcon />
            Destinations
          </h3>
          <Link to="/destinations" className="see-all">All</Link>
        </div>
        <div className="destinations-grid">
          {Destinations.map((dest) => (
            <Link key={dest.city} to={`/search?location=${dest.city}`} className="destination-item">
              <span className="destination-flag">{dest.flag}</span>
              <span className="destination-city">{dest.city}</span>
              <span className="destination-count">{dest.count} stays</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Second Ad */}
      <div className="sidebar-card ad-card secondary">
        <div className="ad-badge">Promoted</div>
        <div className="ad-content">
          <h4>Travel Insurance</h4>
          <p>From R99/day. Cancel anytime.</p>
          <button className="ad-button">Learn More →</button>
        </div>
      </div>
    </div>
  );
}