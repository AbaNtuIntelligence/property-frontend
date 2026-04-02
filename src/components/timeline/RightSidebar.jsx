import React from 'react';
import './Sidebars.css';

export default function RightSidebar({ children }) {
  return (
    <aside className="timeline-sidebar right-sidebar">
      <div className="sidebar-sticky">
        {children}
      </div>
    </aside>
  );
}