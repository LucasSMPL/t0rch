import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export function HashrateChart() {
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

// NOTE: THIS Hashrate-Chart.tsx WILL NEED PROPERLY SETUP.
// IDEAS OF MAKING ADDITIONAL GET REQUEST FOR CERTAIN METRICS HERE
// CREATING HASHRATE CHART, ETC.
// SHOULD WE MOVE THE WHOLE "MINER DETAILS" SHEET / DIALOG HERE?
