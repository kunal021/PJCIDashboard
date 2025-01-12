import GetTestSeriesTests from "./GetTests";
import GetTestTab from "./GetTestsTab";

function GetTestData() {
  return (
    <>
      <div className="px-2 sm:px-10 md:px-20 flex flex-col gap-6 relative">
        <GetTestSeriesTests />
        <GetTestTab />
      </div>
    </>
  );
}

export default GetTestData;
