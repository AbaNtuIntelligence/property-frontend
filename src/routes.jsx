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

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register userType="SEEKER" />} />
      <Route path="/register-owner" element={<Register userType="OWNER" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Marketplace Discovery (OPEN) */}
      <Route path="/properties" element={<TimelineLayout />}>
        <Route index element={<Properties />} />
      </Route>

      <Route path="/property/:id" element={<PropertyDetail />} />

      {/* ================= PROTECTED ================= */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <TimelineLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<WishlistPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <TimelineLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route
        path="/property/new"
        element={
          <ProtectedRoute allowedUserTypes={["OWNER", "ADMIN"]}>
            <PropertyForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/property/edit/:id"
        element={
          <ProtectedRoute allowedUserTypes={["OWNER", "ADMIN"]}>
            <PropertyForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* ================= CLEAN REDIRECTS ================= */}
      <Route path="/owner/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/seeker/dashboard" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}