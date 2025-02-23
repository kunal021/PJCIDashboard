import { useLocation, useNavigate, Outlet } from "react-router-dom";
import SideBar from "../sidebar/Sidebar";
import { HeadingProvider } from "@/context/HeadingProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { MessageCircle } from "lucide-react"; // Import Lucide icon

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
        <div className="relative min-h-screen">
          <SideBar>
            <Outlet />
          </SideBar>

          {/* Floating Chat Button */}
          {location.pathname !== "/chat" && (
            <button
              onClick={() => navigate("/chat")}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          )}
        </div>
      </HeadingProvider>
    </AuthProvider>
  );
};

export default Layout;
