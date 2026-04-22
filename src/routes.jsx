import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Dashboard from "./pages/dashboard/Dashboard";
import TimelineLayout from "./components/layout/TimelineLayout";
import "./styles/global.css";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES - No authentication needed */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register userType="SEEKER" />} />
      <Route path="/register-owner" element={<Register userType="OWNER" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Property detail - Public */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      
      {/* PROTECTED ROUTES - Require authentication (with TimelineLayout) */}
      <Route path="/properties" element={
        <ProtectedRoute>
          <TimelineLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Properties />} />
      </Route>
      
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <TimelineLayout />
        </ProtectedRoute>
      }>
        <Route index element={<WishlistPage />} />
      </Route>
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <TimelineLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
      </Route>
      
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