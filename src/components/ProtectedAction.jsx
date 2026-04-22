// components/ProtectedAction.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

export function ProtectedAction({ children, action, onSuccess }) {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      // User is logged in, perform the action
      onSuccess();
    }
  };

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
}