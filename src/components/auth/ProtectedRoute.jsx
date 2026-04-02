import { Navigate } from 'react-router-dom';
import authService from '../../pages/services/authService';

function ProtectedRoute({ children, allowedUserTypes }) {
    const user = authService.getCurrentUser();
    
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    
    if (allowedUserTypes && !allowedUserTypes.includes(user?.user_type)) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
}

export default ProtectedRoute;