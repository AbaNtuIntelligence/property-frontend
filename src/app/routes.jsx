import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertiesPage from "../features/properties/PropertiesPage";
import PropertyDetailPage from "../features/properties/PropertyDetailPage";
import Login from "../features/auth/Login";
import Dashboard from "../features/auth/Dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PropertiesPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;