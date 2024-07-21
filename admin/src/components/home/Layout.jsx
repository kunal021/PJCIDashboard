/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import Dashboard from "../Dashboard";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex">
      {location.pathname !== "/login" && <Dashboard />}
      {children}
    </div>
  );
};

export default Layout;
