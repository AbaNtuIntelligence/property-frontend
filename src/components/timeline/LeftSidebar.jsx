import React from 'react';
import './Sidebars.css';

export default function LeftSidebar({ children }) {
  return (
    <aside className="timeline-sidebar left-sidebar">
      <div className="sidebar-sticky">
        {children}
      </div>
    </aside>
  );
}