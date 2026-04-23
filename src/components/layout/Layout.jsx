import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-main">
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}