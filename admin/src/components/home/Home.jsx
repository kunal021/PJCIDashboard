import LayoutAdjuster from "../../utils/LayoutAdjuster";
import TotalUsers from "./TotalUsers";
// import TotalCourses from "./TotalCourses";
// import TotalFullCourses from "./TotalFullCourses";
import TotalRevenue from "./TotalRevenue";
import CurrentMonthRevenue from "./CurrentMonthRevenue";
// import TotalUsers from "./TotalUsers";

function Home() {
  return (
    <LayoutAdjuster>
      <div className="flex flex-col flex-wrap justify-center items-center gap-5 w-full my-8">
        <div className="flex flex-wrap justify-center items-center gap-5 w-full">
          <TotalUsers />
          <CurrentMonthRevenue />
        </div>

        <TotalRevenue />
      </div>
    </LayoutAdjuster>
  );
}

export default Home;
