import { useLocation, Outlet } from "react-router-dom";
import SideBar from "../sidebar/Sidebar";
import { HeadingProvider } from "@/context/HeadingProvider";
import { AuthProvider } from "@/context/AuthProvider";

const Layout = () => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <HeadingProvider>
        <div>
          <SideBar>
            <Outlet />
          </SideBar>
        </div>
      </HeadingProvider>
    </AuthProvider>
  );
};

export default Layout;
