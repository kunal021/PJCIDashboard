/* eslint-disable react/prop-types */
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { API_URL } from "../../url";
import axios from "axios";
import toast from "react-hot-toast";

function More({ user }) {
  const [loading, setLoading] = useState(false);
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
  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis className="w-6 h-6" />
      </PopoverTrigger>
      <PopoverContent className="w-fit z-[150]">
        <div className="flex flex-col justify-center items-center gap-3">
          <p className="font-semibold text-lg">
            {user.firstname} {user.lastname}
          </p>
          <p
            onClick={handleGrantUserLogin}
            // className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black py-1 px-2 rounded-md w-full"
            className="cursor-pointer text-sm"
          >
            {loading ? "Granting..." : "Grant User Login"}
          </p>
          {/* <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-black py-1 px-2 rounded-md w-full">
            Delete User
          </button> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default More;
