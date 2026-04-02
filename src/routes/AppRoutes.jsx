import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Properties from "../pages/Properties";
import PropertyDetail from "../pages/PropertyDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Timeline from './pages/timeline/Timeline'; // IMPORT THIS!

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route path="/properties" element={<Properties />} />

      <Route path="/property/:id" element={<PropertyDetail />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      
      <Route path="/timeline" element={<Timeline />} /> {/* ADD THIS ROUTE */}

    </Routes>
  );

}