// App.jsx - Updated with proper routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Pages (Everyone can view)
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';      // Make gallery public
import Admissions from './pages/Admissions'; // Make admissions info public
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Pages (Require login for actions)
import Dashboard from './pages/Dashboard';
import ApplyNow from './pages/ApplyNow';     // Actual application form
import DonatePayment from './pages/DonatePayment'; // Payment page
import Profile from './pages/Profile';

// Component that checks if route requires login
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Don't render anything while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* FULLY PUBLIC ROUTES - No login required to VIEW */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/admissions" element={<Admissions />} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/signup" 
        element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} 
      />
      
      {/* PROTECTED ROUTES - Require login for ACTIONS */}
      <Route 
        path="/apply" 
        element={
          <ProtectedRoute>
            <ApplyNow />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donate" 
        element={
          <ProtectedRoute>
            <DonatePayment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 - Public */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}