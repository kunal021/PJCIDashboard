/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import { Loader2 } from "lucide-react";

function TotalUsers() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserCount = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/admin/dashbord/getusercount.php`
        );
        // console.log(res.data)
        setCount(res.data.total_users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUserCount();
  }, []);
  return (
    <div>
      <div
        className={`bg-blue-500 text-white flex flex-col justify-center items-center gap-3 text-center px-8 border border-gray-200 rounded-lg shadow-md w-[250px] h-[150px]`}
      >
        <p className="text-lg font-semibold">Total Users</p>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <p className="text-xl font-bold">{count}</p>
        )}

        <div>
          <LinkButton to={"/get-users"}>See All</LinkButton>
        </div>
      </div>
    </div>
  );
}

export default TotalUsers;
