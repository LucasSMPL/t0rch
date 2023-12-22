"use client";
import { Progress } from "@/components/ui/progress";

import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { useState } from "react";
import ScanTable from "./components/scan-table";
import ScannerStats from "./components/scanner-stats";
export default function ScannerPage() {
  const { toast } = useToast();

  const [ips, setIps] = useState<ScannedIp[]>([]);
  const [selectedRanges, saveSelectedRanges] = useLocalStorage<IpRange[]>(
    "selected-ranges",
    []
  );
  const [progress, setProgress] = useState<number | null>(null);

  const startScan = async () => {
    if (!selectedRanges.length) {
      return toast({
        title: "Please choose at least one range!",
        variant: "destructive",
      });
    }
    try {
      setProgress(0);
      const response = await fetch(`/api/ip-scanner`, {
        method: "POST",
        body: JSON.stringify({ ranges: selectedRanges }),
      });
      const total = selectedRanges.reduce((t, c) => t + c.end - c.start + 1, 0);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (true && reader != null) {
        const { value, done } = await reader.read();
        if (done) break;
        const d = decoder.decode(value);
        console.log(d);
        const decoded: ScannedIp[] = JSON.parse(`[${d.replace(/}{/g, "},{")}]`);
        setIps((prev) => [...prev, ...decoded]);
        setProgress((ips.length / total) * 100);
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
        />
        <div className="pt-10 flex item-center justify-center">
          {progress != null && (
            <Progress
              indicatorColor={"bg-orange-500"}
              value={progress}
              className="w-[60%]"
            />
          )}
        </div>
      </div>
      <ScanTable scannedIps={ips} />
    </div>
  );
}
