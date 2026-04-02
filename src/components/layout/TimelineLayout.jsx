import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import LeftSidebar from '../timeline/LeftSidebar';
import RightSidebar from '../timeline/RightSidebar';
import { mockTrending, mockSuggested, mockDestinations } from '../../data/mockTimelineData';
import './TimelineLayout.css';

export default function TimelineLayout() {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState('left');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768 && isMobileSidebarOpen) {
        closeMobileSidebar();
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }
  }, [isMobileSidebarOpen]);

  const toggleMobileSidebar = (sidebar = 'left') => {
    setActiveSidebar(sidebar);
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Determine if we're on mobile/tablet
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  return (
    <div className={`timeline-layout ${isScrolled ? 'scrolled' : ''}`}>
      <Navbar />
      
      <div className="timeline-layout-container">
        {/* Left Sidebar - Desktop/Tablet */}
        {!isMobile && (
          <LeftSidebar>
            {/* Profile Card - WITH NULL CHECKS */}
            {user && (
              <div className="sidebar-card profile-card">
                <div className="profile-content">
                  <img 
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format&q=80'} 
                    alt={user?.name || 'User'}
                    className="profile-avatar"
                    loading="lazy"
                  />
                  <div className="profile-info">
                    <h4>{user?.name || 'Guest User'}</h4>
                    <p>📍 {user?.location || 'South Africa'}</p>
                  </div>
                </div>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-value">128</span>
                    <span className="stat-label">Stays</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">24</span>
                    <span className="stat-label">Reviews</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">4.8</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of your left sidebar remains the same */}
            {/* Main Navigation Menu */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3><span>📋</span> Menu</h3>
              </div>
              <nav className="sidebar-menu">
                <Link to="/" className="menu-item active" onClick={closeMobileSidebar}>
                  <span className="menu-icon">🏠</span>
                  <span className="menu-label">Home</span>
                </Link>
                <Link to="/properties" className="menu-item" onClick={closeMobileSidebar}>
                  <span className="menu-icon">🔍</span>
                  <span className="menu-label">Explore</span>
                </Link>
                <Link to="/wishlist" className="menu-item" onClick={closeMobileSidebar}>
                  <span className="menu-icon">❤️</span>
                  <span className="menu-label">Wishlist</span>
                  <span className="menu-badge">12</span>
                </Link>
                <Link to="/dashboard" className="menu-item" onClick={closeMobileSidebar}>
                  <span className="menu-icon">📊</span>
                  <span className="menu-label">Dashboard</span>
                </Link>
              </nav>
            </div>

            {/* Filters Card */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3><span>🔧</span> Quick Filters</h3>
                <Link to="/properties" className="see-all">Reset</Link>
              </div>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="checkbox" /> Pet Friendly 🐾
                </label>
                <label className="filter-option">
                  <input type="checkbox" /> Pool 🏊
                </label>
                <label className="filter-option">
                  <input type="checkbox" /> Backup Power ⚡
                </label>
                <label className="filter-option">
                  <input type="checkbox" /> Braai Area 🍖
                </label>
              </div>
            </div>

            {/* Load Shedding Tip */}
            <div className="load-shedding-tip">
              ⚡ Stage 2 loadshedding today 16:00-20:00
            </div>
          </LeftSidebar>
        )}

        {/* Main Content */}
        <main className={`timeline-main-content ${isTablet ? 'tablet' : ''} ${isMobile ? 'mobile' : ''}`}>
          <Outlet />
        </main>

        {/* Right Sidebar - Desktop only */}
        {!isMobile && !isTablet && (
          <RightSidebar>
            {/* Trending Now Card */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3><span>🔥</span> Trending in SA</h3>
                <Link to="/trending" className="see-all">View All</Link>
              </div>
              <div className="trending-list">
                {mockTrending.map((item, index) => (
                  <Link key={item.id} to={`/property/${item.id}`} className="trending-item">
                    <span className="trending-rank">#{index + 1}</span>
                    <img src={item.image} alt={item.title} className="trending-image" loading="lazy" />
                    <div className="trending-info">
                      <h4>{item.title}</h4>
                      <div className="trending-location">
                        <span>📍</span> {item.location}
                      </div>
                      <div className="trending-meta">
                        <span className="trending-price">{item.price}</span>
                        <span className="trending-score">🔥 {item.score}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Hosts Card */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3><span>⭐</span> Top Hosts</h3>
                <Link to="/hosts" className="see-all">See All</Link>
              </div>
              <div className="suggested-list">
                {mockSuggested.map(host => (
                  <div key={host.id} className="suggested-item">
                    <img src={host.avatar} alt={host.name} className="suggested-avatar" loading="lazy" />
                    <div className="suggested-info">
                      <h4>{host.name}</h4>
                      <div className="suggested-badge">
                        <span>📍 {host.location}</span>
                        {host.properties > 5 && (
                          <span className="superhost-badge">Superhost</span>
                        )}
                      </div>
                    </div>
                    <button className="follow-btn">Follow</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Card */}
            <div className="sidebar-card ad-card">
              <div className="ad-badge">Sponsored</div>
              <div className="ad-content">
                <span className="ad-label">Special Offer</span>
                <h4>List your property</h4>
                <p>Reach millions of travelers in 2026</p>
                <button className="ad-button">Become a Host →</button>
              </div>
            </div>

            {/* Popular Destinations Card */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3><span>🌍</span> Destinations</h3>
                <Link to="/destinations" className="see-all">All</Link>
              </div>
              <div className="destinations-grid">
                {mockDestinations.map(dest => (
                  <Link key={dest.city} to={`/search?location=${dest.city}`} className="destination-item">
                    <div className="destination-flag">{dest.flag}</div>
                    <div className="destination-city">{dest.city}</div>
                    <div className="destination-count">{dest.count} stays</div>
                  </Link>
                ))}
              </div>
            </div>
          </RightSidebar>
        )}
      </div>

      {/* Mobile Sidebar Controls */}
      {isMobile && (
        <div className="mobile-sidebar-controls">
          <button 
            className="mobile-toggle-btn left"
            onClick={() => toggleMobileSidebar('left')}
          >
            <span className="btn-icon">🔍</span>
            <span className="btn-label">Filters</span>
          </button>
          <button 
            className="mobile-toggle-btn right"
            onClick={() => toggleMobileSidebar('right')}
          >
            <span className="btn-icon">⭐</span>
            <span className="btn-label">Featured</span>
          </button>
        </div>
      )}

      {/* Mobile Sidebar Drawer - WITH NULL CHECKS */}
      <div className={`mobile-sidebar-drawer ${isMobileSidebarOpen ? 'open' : ''} ${activeSidebar}`}>
        <div className="mobile-sidebar-header">
          <h3>{activeSidebar === 'left' ? 'Filters & Menu' : 'Featured & Trends'}</h3>
          <button className="close-btn" onClick={closeMobileSidebar}>✕</button>
        </div>
        <div className="mobile-sidebar-content">
          {activeSidebar === 'left' ? (
            /* Mobile Left Sidebar Content - WITH NULL CHECKS */
            <>
              {user && (
                <div className="sidebar-card profile-card">
                  <div className="profile-content">
                    <img 
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format&q=80'} 
                      alt={user?.name || 'User'}
                      className="profile-avatar"
                      loading="lazy"
                    />
                    <div className="profile-info">
                      <h4>{user?.name || 'Guest User'}</h4>
                      <p>📍 {user?.location || 'South Africa'}</p>
                    </div>
                  </div>
                </div>
              )}
              <nav className="sidebar-menu">
                <Link to="/" className="menu-item active" onClick={closeMobileSidebar}>
                  <span className="menu-icon">🏠</span>
                  <span className="menu-label">Home</span>
                </Link>
                <Link to="/properties" className="menu-item" onClick={closeMobileSidebar}>
                  <span className="menu-icon">🔍</span>
                  <span className="menu-label">Explore</span>
                </Link>
                <Link to="/wishlist" className="menu-item" onClick={closeMobileSidebar}>
                  <span className="menu-icon">❤️</span>
                  <span className="menu-label">Wishlist</span>
                </Link>
              </nav>
              <div className="filter-options">
                <h4>Quick Filters</h4>
                <label className="filter-option">
                  <input type="checkbox" /> Pet Friendly 🐾
                </label>
                <label className="filter-option">
                  <input type="checkbox" /> Pool 🏊
                </label>
                <label className="filter-option">
                  <input type="checkbox" /> Backup Power ⚡
                </label>
              </div>
            </>
          ) : (
            /* Mobile Right Sidebar Content */
            <>
              <div className="sidebar-card">
                <h4>🔥 Trending Now</h4>
                {mockTrending.slice(0, 3).map(item => (
                  <Link key={item.id} to={`/property/${item.id}`} className="trending-item">
                    <img src={item.image} alt={item.title} className="trending-image" loading="lazy" />
                    <div className="trending-info">
                      <h4>{item.title}</h4>
                      <p>{item.location}</p>
                      <span className="trending-price">{item.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="sidebar-card">
                <h4>⭐ Top Hosts</h4>
                {mockSuggested.slice(0, 3).map(host => (
                  <div key={host.id} className="suggested-item">
                    <img src={host.avatar} alt={host.name} className="suggested-avatar" loading="lazy" />
                    <div className="suggested-info">
                      <h4>{host.name}</h4>
                      <p>{host.location}</p>
                    </div>
                    <button className="follow-btn">Follow</button>
                  </div>
                ))}
              </div>

              <div className="sidebar-card ad-card">
                <div className="ad-content">
                  <h4>List your property</h4>
                  <p>Reach millions in 2026</p>
                  <button className="ad-button">Learn More</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay when mobile sidebar is open */}
      {isMobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}
    </div>
  );
}