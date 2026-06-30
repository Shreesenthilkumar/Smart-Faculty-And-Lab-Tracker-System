import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Guards a route behind login, and optionally behind a set of roles.
 * Renders inside the shared Layout (navbar + container) automatically.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, initializing, user } = useAuth();

  if (initializing) {
    return <LoadingSpinner label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
}
