import React, { useState } from 'react';
import './MobileSidebarToggle.css';

export default function MobileSidebarToggle() {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  return (
    <>
      <div className="mobile-sidebar-toggles">
        <button 
          className="mobile-toggle-btn left"
          onClick={() => setShowLeft(!showLeft)}
        >
          ☰ Filters
        </button>
        <button 
          className="mobile-toggle-btn right"
          onClick={() => setShowRight(!showRight)}
        >
          ⚡ Featured
        </button>
      </div>

      <div className={`mobile-sidebar left ${showLeft ? 'active' : ''}`}>
        <div className="mobile-sidebar-header">
          <h3>Filters & Categories</h3>
          <button onClick={() => setShowLeft(false)}>✕</button>
        </div>
        <div className="mobile-sidebar-content">
          {/* Copy your left sidebar content here */}
        </div>
      </div>

      <div className={`mobile-sidebar right ${showRight ? 'active' : ''}`}>
        <div className="mobile-sidebar-header">
          <h3>Featured & Ads</h3>
          <button onClick={() => setShowRight(false)}>✕</button>
        </div>
        <div className="mobile-sidebar-content">
          {/* Copy your right sidebar content here */}
        </div>
      </div>
    </>
  );
}