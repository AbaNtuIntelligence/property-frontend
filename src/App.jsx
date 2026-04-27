import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import LandingPage from './pages/landingPage/LandingPage';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Timeline from './pages/timeline/Timeline';
import Dashboard from './pages/dashboard/Dashboard';
import PropertyDetailsPage from './pages/property-detail/PropertyDetailsPage';
import CreateProperty from './pages/properties/CreateProperty';
import PropertiesPage from './pages/properties/PropertiesPage'; // Add this import

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/timeline" element={<Layout><Timeline /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/properties" element={<Layout><PropertiesPage /></Layout>} />
          <Route path="/property/:id" element={<Layout><PropertyDetailsPage /></Layout>} />
          <Route path="/property/new" element={<Layout><CreateProperty /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;