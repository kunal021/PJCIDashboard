/* eslint-disable react/prop-types */
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import axios from "axios";
import toast from "react-hot-toast";
import GrantPermission from "./GrantPermissions";

function More({ user, roles }) {
  const [loading, setLoading] = useState(false);
  const [authRole, setAuthRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(roles[0]?.value);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("authToken"));
    setAuthRole(role?.role);
  }, []);

  const handleGrantUserLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/admin/user/grantusertologin.php`,
        {
          user_id: user.mo_number,
        },
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/admin/user/updaterole.php`,
        {
          mo_number: user.mo_number,
          role: selectedRole,
        },
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800" />
      </PopoverTrigger>
      <PopoverContent className="w-[80%] mx-auto md:w-fit z-[150] bg-white shadow-md rounded-lg p-4">
        <div className="flex flex-col justify-center items-center gap-3">
          <p className="font-semibold text-lg text-gray-800">
            {user.firstname} {user.lastname}
          </p>
          {(authRole == "6" || authRole == "4") && (
            <>
              <div className="w-full space-y-2">
                <label
                  className="text-sm font-semibold text-gray-600"
                  htmlFor="role-select"
                >
                  Assign Role:
                </label>
                <select
                  id="role-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignRole}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out"
                >
                  {loading ? "Assigning..." : "Assign Role"}
                </button>
              </div>
              <GrantPermission
                userId={"9998021218"}
                defaultPermissions={{
                  courses: "0",
                  dashboard: "0",
                  category: "0",
                  test_series: "0",
                  videos: "0",
                  documents: "0",
                  books: "0",
                  news: "0",
                  users: "0",
                  payments: "0",
                  gallery: "0",
                  app_slider: "0",
                  send_notification: "0",
                  aboutus: "0",
                  tandc: "0",
                  privacy_policy: "0",
                  server_status: "0",
                }}
              />
            </>
          )}

          <button
            onClick={handleGrantUserLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out"
          >
            {loading ? "Granting..." : "Grant User Login"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default More;
