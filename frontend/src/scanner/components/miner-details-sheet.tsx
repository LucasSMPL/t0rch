import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScannedIp } from "@/lib/types";
import { RebootButton } from "./reboot-button";

export const MinerDetailsSheet = ({ miner }: { miner: ScannedIp }) => {
  //   const chartData = useQuery(["hashrate_history", miner.ip], async () => {
  //     const res = await axios.get<HashrateHistoryApiRes>(
  //       `http://localhost:7070/hashrate_history/${miner.ip}`
  //     );
  //     if (res.status != 200) throw new Error(res.statusText);
  //     return res.data;
  //   });
  //   console.log(chartData.data);

  return (
    <Sheet>
      <Button asChild variant={"outline"} className="mr-4">
        <SheetTrigger>Miner Details</SheetTrigger>
      </Button>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-scroll">
        <CardContent className="p-6 text-sm">
          <HashrateChart />
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Antminer S21 Pro</span>
                <span>219 / 220 TH/S</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Control Board:</span>
                <span className="text-muted-foreground">
                  {miner.controller}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hashboards:</span>
                <span className="text-muted-foreground">BHB4261</span>
              </li>
              <li className="flex items-center justify-between">
                <span>PSU:</span>
                <span className="text-muted-foreground">APW12-15c</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Pool 1:</span>
                <span>Luxor</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Pool 2:</span>
                <span>Nicehash</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Pool 3:</span>
                <span>Braiins</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Worker 1:</span>
                <span>adamhaynes.1</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Worker 2:</span>
                <span>adamhaynes.2</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Worker 3:</span>
                <span>adamhaynes.3</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <RebootButton miners={[miner]} />
            </div>
            <div className="flex flex-col gap-3">
              <Button>Create Repair Ticket</Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button style={{ backgroundColor: "#e94d1b" }}>
                Change Pools
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button style={{ backgroundColor: "#e94d1b" }}>
                IP Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </SheetContent>
    </Sheet>
  );
};

const data = [
  {
    chain1: 400, // Find Real Values in Gigahash, Display in TH ideally. S19 series around 30-40 TH per board. Total of 100+ TH.
    chain2: 240, // Find Real Values in Gigahash, Display in TH ideally. S19 series around 30-40 TH per board. Total of 100+ TH.
    chain3: 110, // Find Real Values in Gigahash, Display in TH ideally. S19 series around 30-40 TH per board. Total of 100+ TH.
  },
  {
    average: 300,
    today: 139,
  },
  {
    average: 200,
    today: 980,
  },
  {
    average: 278,
    today: 390,
  },
  {
    average: 189,
    today: 480,
  },
  {
    average: 239,
    today: 380,
  },
  {
    average: 349,
    today: 430,
  },
];

function HashrateChart() {
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
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Tooltip
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
                              {payload[0].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Today
                            </span>
                            <span className="font-bold">
                              {payload[1].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="average"
                stroke="#e94d1b" // Set the line color here
                activeDot={{
                  r: 6,
                  style: { fill: "#e94d1b", opacity: 0.25 }, // Set the active dot color here
                }}
              />
              <Line
                type="monotone"
                dataKey="today"
                strokeWidth={2}
                stroke="#e94d1b" // Set the line color here
                activeDot={{
                  r: 8,
                  style: { fill: "#e94d1b" }, // Set the active dot color here
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
