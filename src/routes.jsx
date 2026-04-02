import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";  // Add Navigate here
import TimelineLayout from "./components/layout/TimelineLayout";
import LandingPage from "./pages/landingPage/LandingPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Properties from "./pages/properties/Properties";
import PropertyDetail from "./pages/property-detail/PropertyDetail";
import BookingPage from "./pages/booking/BookingPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import PropertyForm from "./components/property/PropertyForm";
import Unauthorized from "./components/common/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./styles/global.css";





export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes without sidebar layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register userType="SEEKER" />} />
      <Route path="/register-owner" element={<Register userType="OWNER" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Routes with the timeline layout (with sidebars) */}
      <Route path="/" element={<TimelineLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="properties" element={<Properties />} />
        <Route path="wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Property routes */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      
      {/* Owner only property routes */}
      <Route path="/property/new" element={
        <ProtectedRoute allowedUserTypes={['OWNER', 'ADMIN']}>
          <PropertyForm />
        </ProtectedRoute>
      } />
      <Route path="/property/edit/:id" element={
        <ProtectedRoute allowedUserTypes={['OWNER', 'ADMIN']}>
          <PropertyForm />
        </ProtectedRoute>
      } />
      
      {/* Booking route */}
      <Route path="/booking/:id" element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      } />
      
      {/* Redirects */}
      <Route path="/owner/dashboard" element={<Navigate to="/dashboard" />} />
      <Route path="/seeker/dashboard" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}