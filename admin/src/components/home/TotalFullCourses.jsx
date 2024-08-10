import { useEffect, useState } from "react";
import axios from "axios";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import { Loader2 } from "lucide-react";

function TotalFullCourses() {
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
      <div className="flex flex-col justify-center items-center gap-5 text-center px-8 py-8 border border-gray-200 rounded-lg shadow-md w-[350px]">
        <p className="text-2xl font-semibold">Total Full Courses</p>
        {loading ? (
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        ) : (
          <p className="text-3xl font-bold">{count}</p>
        )}
        <div>
          <LinkButton to={"/get-full-course"}>See All FUll Courses</LinkButton>
        </div>
      </div>
    </div>
  );
}

export default TotalFullCourses;
