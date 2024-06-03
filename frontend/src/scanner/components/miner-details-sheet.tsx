import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScannedIp } from "@/lib/types";
import { RebootButton } from "./reboot-button";
// import { FactoryResetButton } from "./factory-reset-button";
// import { ShowLogsDialog } from "./antminer-log-dialog";
import { Switch } from "@/components/ui/switch";
import { FactoryResetButton } from "./factory-reset-button";

export const MinerDetailsSheet = ({ miner }: { miner: ScannedIp }) => {
  //   const chartData = useQuery(["hashrate_history", miner.ip], async () => {
  //     const res = await axios.get<HashrateHistoryApiRes>(
  //       `http://localhost:7070/hashrate_history/${miner.ip}`
  //     );
  //     if (res.status != 200) throw new Error(res.statusText);
  //     return res.data;
  //   });
  //   console.log(chartData.data);
  console.log("Ideal Rate", miner.rate_ideal)
  console.log("Pool URL", miner.url)
  const formattedHashrate = (miner.hashrate / 1000).toFixed(2);

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
                <span className="text-muted-foreground">{miner.miner_type}</span>
                <span>{formattedHashrate} TH/S</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">IP:</span>
                <span><a href={`http://root:root@${miner.ip}`}>{miner.ip}</a></span>
              </li>
              <li className="flex items-center justify-between">
                <span>Control Board:</span>
                <span className="text-muted-foreground">
                  {miner.controller}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hashboards:</span>
                <span className="text-muted-foreground">{miner.hashboard_type}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>PSU:</span>
                <span className="text-muted-foreground">{miner.power_type}</span>
              </li>
            </ul>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Pool:</span>
                <span>{miner.url}</span>
              </li>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Worker 1:</span>
                <span>{miner.worker}</span>
              </li>
            </ul>
            <ul className="grid gap-3">
            <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Blink:</span>
                <span><Switch /></span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">FW Ver:</span>
                <span>{miner.compile_time}</span>
              </li>
            </ul>
            <RebootButton miners={[miner]} />
            <Button variant={"outline"}>View Hashboards</Button>
            <Button variant={"outline"}>Change Pools</Button>
            <Button variant={"outline"}>Network Settings</Button>
            <Button variant={"outline"}>Read Logs</Button>
            <FactoryResetButton miners={[miner]}/>
          </div>
          {/* <Separator className="my-4" />
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
            <div className="flex flex-col gap-3">
              <ShowLogsDialog miners={[miner]} />
            </div>
            <div className="flex flex-col gap-3">
              <FactoryResetButton miners={[miner]}/>
            </div>
          </div> */}
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
