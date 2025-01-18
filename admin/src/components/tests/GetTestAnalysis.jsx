/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Clock, Users, FileQuestion } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/url";
import { useEffect, useState } from "react";
import Loader from "@/utils/Loader";
import { useIsMobile } from "@/hooks/use-mobile";

const fetchTestData = async (setTest, setLoading, testId) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("test_id", testId);
    const response = await axios.post(
      `${API_URL}/admin/test/testreport.php`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.status === 200) {
      setTest(response.data.data[0]);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

export default function GetTestAnalysis({ testId }) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState({});

  useEffect(() => {
    fetchTestData(setTest, setLoading, testId);
  }, [testId]);

  const chartData = [
    { name: "Lowest", value: parseFloat(test?.lowest_mark) },
    { name: "Average", value: parseFloat(test?.average_mark) },
    { name: "Highest", value: parseFloat(test?.highest_mark) },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-8 min-h-screen">
          <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center">
            Test Analysis
          </h1>
          <div className="flex flex-wrap justify-start items-center gap-4">
            <StatCard
              title="Total Users"
              value={test?.total_users}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Avg Time"
              value={`${(parseFloat(test?.average_time) / 60).toFixed(0)} Min`}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Total Qns"
              value={test?.total_questions}
              icon={<FileQuestion className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <Card className="mt-6 w-[90%]">
            <CardHeader>
              <CardTitle>Mark Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 flex justify-center items-center">
              <ChartContainer
                config={{
                  value: {
                    label: "Mark",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px] sm:h-[300px] max-sm:w-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={
                      isMobile
                        ? { top: 10, right: 10, left: 0, bottom: 10 }
                        : { top: 20, right: 30, left: 20, bottom: 20 }
                    }
                  >
                    <XAxis
                      dataKey="name"
                      tick={isMobile ? { fontSize: 12 } : {}}
                    />
                    <YAxis tick={isMobile ? { fontSize: 12 } : {}} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 sm:gap-5 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
