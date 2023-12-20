"use client";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useState } from "react";
import ScanTable from "./components/scan-table";
import ScannerStats from "./components/scanner-stats";

export default function ScannerPage() {
  const [ips, setIps] = useState<ScannedIp[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const startScan = async () => {
    try {
      setProgress(0);
      const response = await fetch(`/api/stream-test`, { method: "GET" });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (true && reader != null) {
        const { value, done } = await reader.read();
        if (done) break;
        const decoded: StreamRes<ScannedIp> = JSON.parse(decoder.decode(value));
        setIps((prev) => [...prev, decoded.result]);
        setProgress((decoded.done / decoded.total) * 100);
      }
      const res = await axios.post<ScannedIp[]>("/api/ip-scanner", {
        address: "10.0.123",
        start: 75,
        end: 95,
      });
      console.log(res.data);
      setIps(res.data);
    } catch (error) {
      console.error("Error during scan:", error);
    } finally {
      setProgress(null);
    }
  };
  return (
    <div style={{ marginLeft: "40px", marginRight: "40px" }}>
      <div className="pt-10" style={{ marginBottom: "20px" }}>
        <ScannerStats
          onScan={startScan}
          scanCount={ips.length}
          underhashingCount={ips.filter((e) => e.is_underhashing).length}
        />
        {progress != null && <Progress value={progress} className="w-[60%]" />}
      </div>
      <ScanTable scannedIps={ips} />
    </div>
  );
}
