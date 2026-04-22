import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function requireAuth(callback) {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    callback();
  }

  return { requireAuth, user };
}