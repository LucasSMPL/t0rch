import { Line, LineChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartApiRes, ScannedIp } from "@/lib/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useQuery } from "react-query";

type LineChartDataPoint = {
  [key: string]: number | string;
};

export const HashrateChart = ({ miner }: { miner: ScannedIp }) => {
  const chartData = useQuery(["chart", miner.ip], async () => {
    const res = await axios.get<ChartApiRes>(
      `http://localhost:7070/chart/${miner.ip}/`
    );
    if (res.status != 200) throw new Error(res.statusText);
    return res.data?.xAxis.map((x, i) => {
      const r: LineChartDataPoint = {
        time: x,
      };
      res.data?.series.forEach((s) => {
        r[s.name] = s.data[i] as number;
      });
      return r;
    });
  });
  console.log(chartData.data);
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Hashrate Chart</CardTitle>
        <CardDescription>
          Miner hashrate chart for elapsed uptime only.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="80%">
            {chartData.isLoading ? (
              <Loader2 className="animate-spin" />
            ) : chartData.isError ? (
              <p>Error: {JSON.stringify(chartData.error)}</p>
            ) : (
              <LineChart
                data={chartData.data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                {/* <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Average
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0]?.value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Today
                              </span>
                              <span className="font-bold">
                                {payload[1]?.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  }}
                /> */}
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="chain0"
                  stroke="#e94d1b"
                  activeDot={{
                    r: 2,
                    style: { fill: "#e94d1b" },
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="chain1"
                  stroke="#e94d1b"
                  activeDot={{
                    r: 2,
                    style: { fill: "#e94d1b" },
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="chain2"
                  stroke="#e94d1b"
                  activeDot={{
                    r: 2,
                    style: { fill: "#e94d1b" },
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
