import { useParams } from "react-router-dom";
import GetRankList from "./GetRankList";
import GetTestAnalysis from "./GetTestAnalysis";
import { useEffect } from "react";
import { useHeading } from "@/hooks/use-heading";

function GetTestReport() {
  const { id } = useParams();
  const { setHeading } = useHeading();
  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center my-2">
          Test Report
        </h1>
      </div>
    );
  }, [setHeading]);
  return (
    <>
      <GetTestAnalysis testId={id} />
      <GetRankList testId={id} />
    </>
  );
}

export default GetTestReport;
