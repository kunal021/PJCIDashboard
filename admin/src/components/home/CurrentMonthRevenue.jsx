/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
// import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import { Loader2 } from "lucide-react";
import { getMonth } from "../../utils/getMonth";

function CurrentMonthRevenue() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getrevenue = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/admin/dashbord/getrevenue.php`
        );
        console.log(response);
        setCount(response.data.data[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getrevenue();
  }, []);

  //   console.log(count);
  return (
    <div>
      <div
        className={`bg-green-500 text-white flex flex-col justify-center items-center gap-3 text-center px-8 border border-gray-200 rounded-lg shadow-md w-[250px] h-[150px]`}
      >
        <p className="text-lg font-semibold">
          {getMonth(new Date(count.month))} Revenue
        </p>
        {loading ? (
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        ) : (
          <p className="text-xl font-bold">₹ {count.total_revenue}</p>
        )}

        {/* <div>
          <LinkButton to={"/get-users"}>See All</LinkButton>
        </div> */}
      </div>
    </div>
  );
}

export default CurrentMonthRevenue;
