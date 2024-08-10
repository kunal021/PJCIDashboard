import LayoutAdjuster from "../../utils/LayoutAdjuster";
import TotalRevnue from "./TotalRevnue";
import TotalUsers from "./TotalUsers";

function Home() {
  return (
    <LayoutAdjuster>
      <div className="flex flex-col justify-center items-center w-full">
        <TotalUsers />
        <TotalRevnue />
      </div>
    </LayoutAdjuster>
  );
}

export default Home;
