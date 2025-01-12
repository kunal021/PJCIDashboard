import TotalUsers from "./TotalUsers";
import TotalRevenue from "./TotalRevenue";
import CurrentMonthRevenue from "./CurrentMonthRevenue";
import { useHeading } from "@/hooks/use-heading";
import { useEffect } from "react";

function Home() {
  const { setHeading } = useHeading();
  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">Dashboard</h1>
      </div>
    );
  }, [setHeading]);
  return (
    <div className="flex flex-col flex-wrap justify-center items-center gap-5 w-full my-8">
      <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
        <TotalUsers />
        <CurrentMonthRevenue />
      </div>

      <TotalRevenue />
    </div>
  );
}

export default Home;
