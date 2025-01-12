import { useLocation, Outlet } from "react-router-dom";
import SideBar from "../sidebar/Sidebar";
import { HeadingProvider } from "@/context/HeadingProvider";

const Layout = () => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Outlet />;
  }

  return (
    <HeadingProvider>
      <div>
        <SideBar>
          <Outlet />
        </SideBar>
      </div>
    </HeadingProvider>
  );
};

export default Layout;
