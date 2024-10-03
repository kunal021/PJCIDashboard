import LayoutAdjuster from "@/utils/LayoutAdjuster";
import GetTestSeriesTests from "./GetTests";
import GetTestTab from "./GetTestsTab";

function GetTestData() {
  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col gap-6 relative">
        <GetTestSeriesTests />
        <GetTestTab />
      </div>
    </LayoutAdjuster>
  );
}

export default GetTestData;
