import { useEffect, useState } from "react";
import axios from "axios"
import LinkButton from "../../utils/LinkButton";

function Home() {
    const [count, setCount] = useState(0);


    useEffect(() => {
        const getUserCount = async () => {
            try {
                const res = await axios.get("http://localhost/PJCIDB/admin/dashbord/getusercount.php");
                // console.log(res.data)
                setCount(res.data.total_users)
            } catch (error) {
                console.log(error)
            }
        }

        getUserCount();

    }, [])
    return (
        <div>
            <div className="flex flex-col justify-center items-center space-y-2 text-center m-10 px-6 py-4 border-2 border-transparent rounded-xl bg-black/20">
                <p>Total Users</p>
                <p>{count}</p>
                <div className="scale-75">
                    <LinkButton to={"/get-users"}>See All Users</LinkButton>
                </div>
            </div>
        </div>
    );
}

export default Home;
