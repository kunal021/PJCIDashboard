/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const PrivateRoute = ({ element: Component }) => {
  const location = useLocation();
  if (isAuthenticated() && location.pathname === "/login") {
    <Navigate to="/" replace={true} />;
  }

  return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
