/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

// Mock authentication function
const isAuthenticated = () => {
  // Implement your authentication logic here
  // For example, check if a token exists in local storage
  return !!localStorage.getItem("authToken");
};

const PrivateRoute = ({ element: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
