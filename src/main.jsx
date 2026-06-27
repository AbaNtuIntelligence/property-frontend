import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Add at the top
console.log('App Version: 2.0.0 - ' + Date.now());

// Your existing code...
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);