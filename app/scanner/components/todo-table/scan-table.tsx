import React, { useState } from 'react';
import { DataTable } from "@/components/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TodoColumns } from "./scan-columns";

export default function TodoTable() {
  const [tasks, setTasks] = useState([]);

  const startScan = async () => {
    try {
      const response = await fetch("/api/api-test");
      const data = await response.json();

      console.log("API Response:", data);

      if (data && data.INFO && data.INFO.type && Array.isArray(data.SUMMARY)) {
        const minerType = data.INFO.type;

        const parsedData = data.SUMMARY.map((summary: any, index: any) => ({
          id: String(index),
          ip: "Unknown", 
          miner_type: minerType,
          worker: "Unknown",
          pool_1: "Unknown",
          uptime: `${summary.elapsed}`,
          hashrate: `${summary.rate_avg} ${summary.rate_unit}`,
          fan_count: "Unknown",
          hb_count: "Unknown",
          psu_type: "Unknown",
          controller: "Unknown",
        }));

        setTasks(parsedData);
      } else {
        console.error("Expected data fields missing:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
    <Button onClick={startScan}>Start Scan</Button>
    <Card>
      <DataTable
        title="t0rch - btc tools but better"
        description="t0rch is in beta, launching 2024."
        data={tasks}
        columns={TodoColumns}
        searchColumnId="title"
        filters={[]}
      />
    </Card>
    </div>
  );
}

const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

const tasks = [
  {
    id: '1',
    ip: '10.0.101.1',
    miner_type: 'Antminer S19 XP',
    worker: 'lucasminer.1',
    pool_1: 'btc.global.luxor.tech:700',
    uptime: '1 Day, 14 Minutes',
    hashrate: '141.15 TH',
    fan_count: '4',
    hb_count: '3',
    psu_type: 'APW1215a',
    controller: 'Xilinx',
  },
];


// Temperature
// Firmware Version