"use client";
import axios from "axios";
import { useState } from "react";
import ScanTable from "./components/scan-table";
import ScannerStats from "./components/scanner-stats";

export default function ScannerPage() {
  const [ips, setIps] = useState<ScannedIp[]>([]);
  const startScan = async () => {
    try {
      const res = await axios.post<ScannedIp[]>("/api/ip-scanner", {
        address: "10.0.215",
        start: 1,
        end: 5,
      });
      console.log(res.data);
      setIps(res.data);
    } catch (error) {
      console.error("Error during scan:", error);
    }
  };
  return (
    <div>
      <div className="pt-10" style={{ marginBottom: "40px" }}>
        <ScannerStats onScan={startScan} />
      </div>
      <ScanTable scannedIps={ips} />
    </div>
  );
}
