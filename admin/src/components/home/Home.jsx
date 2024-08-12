import LayoutAdjuster from "../../utils/LayoutAdjuster";
import TotalCount from "./TotalCount";
// import TotalCourses from "./TotalCourses";
// import TotalFullCourses from "./TotalFullCourses";
// import TotalRevenue from "./TotalRevenue";
// import TotalUsers from "./TotalUsers";

function Home() {
  return (
    <LayoutAdjuster>
      <div className="flex flex-col flex-wrap justify-center items-center gap-5 w-full my-8">
        <div className="flex flex-wrap justify-center items-center gap-5 w-full">
          <TotalCount
            name="Total Users"
            url="/admin/dashbord/getusercount.php"
            link={"/get-users"}
            otherClass={"bg-blue-500 text-white"}
          />
          {/* <TotalCount
            name="August Revenue"
            url="/admin/dashbord/getusercount.php"
            link={"/get-test"}
            otherClass={"bg-purple-500 text-white"}
          /> */}
        </div>

        {/* <TotalRevenue /> */}
      </div>
    </LayoutAdjuster>
  );
}

export default Home;
