/* eslint-disable react/prop-types */
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ConfirmDelete from "../../utils/ConfirmDelete";
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
      <PopoverContent className="w-fit">
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="font-semibold">
            {user.firstname} {user.Lastname}
          </p>
          <ConfirmDelete
            handleClick={() => {
              // Handle delete button click
            }}
          />
          <button
            onClick={handleGrantUserLogin}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-1 px-2 rounded-md"
          >
            {loading ? "Granting..." : "Grant User Login"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default More;
