import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './pages/landingPage/LandingPage';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CreateProperty from './pages/properties/CreateProperty';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredUserType }) => {
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requiredUserType && user.user_type !== requiredUserType) {
    // Redirect to the correct dashboard for their user type
    const correctPath = user.user_type === 'owner' ? '/dashboard/owner' : '/dashboard/seeker';
    return <Navigate to={correctPath} />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/property/new" element={
          <ProtectedRoute requiredUserType="owner">
          <CreateProperty />
          </ProtectedRoute>
          } />
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard - redirects based on user type */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Owner specific dashboard */}
          <Route path="/dashboard/owner" element={
            <ProtectedRoute requiredUserType="owner">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Seeker specific dashboard */}
          <Route path="/dashboard/seeker" element={
            <ProtectedRoute requiredUserType="seeker">
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;