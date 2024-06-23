import { useEffect, useState } from "react";
import axios from "axios";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import LayoutAdjuster from "../../utils/LayoutAdjuster";

function Home() {
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
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center space-y-2 text-center m-10 px-6 py-4 border-2 border-transparent rounded-xl bg-black/20">
          <p>Total Users</p>
          <p>{count}</p>
          <div className="scale-75">
            <LinkButton to={"/get-users"}>See All Users</LinkButton>
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default Home;
