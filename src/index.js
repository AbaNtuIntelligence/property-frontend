import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/Auth';  // Update this path
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);