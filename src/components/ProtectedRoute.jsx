import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children, allowedUserTypes }) {
  const { user, loading } = useAuth();
  
  // Show loading while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user type is allowed (case insensitive)
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    const userType = user.user_type?.toUpperCase();
    const isAllowed = allowedUserTypes.some(type => type === userType);
    if (!isAllowed) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
}