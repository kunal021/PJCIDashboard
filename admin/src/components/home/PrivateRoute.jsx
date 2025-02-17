/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  // Add basic validation to ensure token exists and is not empty
  return token && token.length > 0;
};

const PrivateRoute = ({ element: Component }) => {
  const location = useLocation();

  // Check if user is authenticated
  const authenticated = isAuthenticated();

  // If authenticated and trying to access login page, redirect to home
  if (authenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, redirect to login while saving the attempted URL
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and trying to access a protected route, allow access
  return <Component />;
};

export default PrivateRoute;
