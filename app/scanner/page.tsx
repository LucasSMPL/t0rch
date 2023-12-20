"use client";
import { Progress } from "@/components/ui/progress";

import { useToast } from "@/components/ui/use-toast";
import { useIsClient } from "@uidotdev/usehooks";
import { useState } from "react";
import ScanTable from "./components/scan-table";
import ScannerStats from "./components/scanner-stats";
export default function ScannerPage() {
  const isClient = useIsClient();
  const { toast } = useToast();

  const [ips, setIps] = useState<ScannedIp[]>([]);
  const [range, setRange] = useState<IpRange | undefined>(undefined);
  const [progress, setProgress] = useState<number | null>(null);

  if (isClient === false) {
    return null;
  }
  const startScan = async () => {
    if (!range) {
      return toast({
        title: "Please choose a range first",
        variant: "destructive",
      });
    }
    try {
      setProgress(0);
      const response = await fetch(`/api/ip-scanner`, {
        method: "POST",
        body: JSON.stringify({ address: range?.address, start: 1, end: 100 }),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (true && reader != null) {
        const { value, done } = await reader.read();
        if (done) break;
        const decoded: StreamRes<ScannedIp> = JSON.parse(decoder.decode(value));
        setIps((prev) => [...prev, decoded.result]);
        setProgress((decoded.done / decoded.total) * 100);
      }
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
          lessThan3Count={ips.filter((e) => e.hb_count < 3).length}
          range={range}
          setRange={setRange}
        />
        {progress != null && <Progress value={progress} className="w-[60%]" />}
      </div>
      <ScanTable scannedIps={ips} />
    </div>
  );
}
