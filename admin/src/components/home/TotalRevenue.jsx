import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import { getMonth } from "../../utils/getMonth";
import { Loader2 } from "lucide-react";

const chartConfig = {
  desktop: {
    label: "Revnue",
    color: "hsl(var(--chart-1))",
  },
};

function TotalRevenue() {
  const [count, setCount] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getrevenue = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/admin/dashbord/getrevenue.php`
        );
        if (response.status === 200) {
          setCount(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getrevenue();
  }, []);

  const chartData = count
    .slice(1, 7)
    .reverse()
    .map((item) => ({
      month: getMonth(new Date(item?.month)),
      desktop: item?.total_revenue,
    }));
  return (
    <Card className="w-[90%] max-w-[33rem] mx-auto">
      <CardHeader>
        <CardTitle className="text-center sm:text-left">Revenue</CardTitle>
        <CardDescription className="text-center sm:text-left">
          Last {chartData.length} Months Revenue in INR
        </CardDescription>
      </CardHeader>
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        </div>
      ) : (
        <CardContent>
          {!count || count.length < 2 ? (
            <div className="text-center">No Data Found</div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 10,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  radius={8}
                  maxBarSize={30}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default TotalRevenue;
