import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { BookingProvider } from "./context/BookingContext";
import { WishlistProvider } from "./context/WishlistContext";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/landingPage/LandingPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Properties from "./pages/properties/Properties";
import PropertyDetail from "./pages/property-detail/PropertyDetail";
import CreateProperty from "./pages/properties/CreateProperty"; // ← ADD THIS
import BookingPage from "./pages/booking/BookingPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Timeline from "./pages/timeline/Timeline";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import OwnerPropertyManager from "./pages/owner/OwnerPropertyManager"; // ← ADD THIS
import "./styles/global.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <BookingProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<Properties />} />
                
                {/* ✅ Specific route FIRST - for creating a new property */}
                <Route path="/property/new" element={<CreateProperty />} />
                
                {/* ✅ Dynamic route SECOND - for viewing a specific property */}
                <Route path="/property/:id" element={<PropertyDetail />} />
                
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                
                {/* ✅ Owner routes */}
                <Route path="/owner/properties" element={<OwnerPropertyManager />} />
              </Routes>
            </Layout>
          </BookingProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;