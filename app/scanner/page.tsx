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
        address: "10.0.115",
        start: 1,
        end: 10,
      });
      console.log(res.data);
      setIps(res.data);
    } catch (error) {
      console.error("Error during scan:", error);
    }
  };
  return (
    <div style={{ marginLeft: "40px", marginRight: "40px" }}>
      <div className="pt-10" style={{ marginBottom: "20px" }}>
        <ScannerStats onScan={startScan} scanCount={ips.length}/>
      </div>
      <ScanTable scannedIps={ips} />
    </div>
  );
}
