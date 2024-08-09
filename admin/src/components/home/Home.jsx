import LayoutAdjuster from "../../utils/LayoutAdjuster";
import TotalUsers from "./TotalUsers";

function Home() {
  return (
    <LayoutAdjuster>
      <div className="flex flex-col justify-center items-center w-full">
        <TotalUsers />
      </div>
    </LayoutAdjuster>
  );
}

export default Home;
