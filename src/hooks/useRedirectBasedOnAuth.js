// hooks/useRedirectBasedOnAuth.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useRedirectBasedOnAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const redirectForListProperty = () => {
    if (isAuthenticated) {
      navigate('/create-property');
    } else {
      navigate('/register', { state: { from: 'list-property' } });
    }
  };

  const redirectForProtectedRoute = (destination) => {
    if (isAuthenticated) {
      navigate(destination);
    } else {
      navigate('/login', { state: { from: destination } });
    }
  };

  return { redirectForListProperty, redirectForProtectedRoute };
};