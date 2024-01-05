"use client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState } from "react";
// import { useLocalStorage } from "usehooks-ts";
import { useLocalStorageValue } from "@react-hookz/web";
import ScanTable from "./components/scan-table";
import ScannerStats from "./components/scanner-stats";
export default function ScannerPage() {
  const { toast } = useToast();

  const [ips, setIps] = useState<ScannedIp[]>([]);
  const selectedRanges = useLocalStorageValue<IpRange[]>("selected-ranges", {
    defaultValue: [],
    initializeWithValue: false,
  });
  const [progress, setProgress] = useState<number | null>(null);
  const total = useMemo(
    () =>
      selectedRanges.value?.reduce((t, c) => t + c.end - c.start + 1, 0) ?? 0,
    [selectedRanges]
  );

  const startScan = async () => {
    if (!selectedRanges.value?.length) {
      return toast({
        title: "Please choose at least one range!",
        variant: "destructive",
      });
    }
    try {
      setProgress(0);
      setIps([]);
      const response = await fetch(`http://localhost:7070/scan`, {
        method: "POST",
        body: JSON.stringify({
          ranges: selectedRanges.value?.map((e) => ({
            start: `${e.address}.${e.start}`,
            end: `${e.address}.${e.end}`,
          })),
        }),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (true && reader != null) {
        const { value, done } = await reader.read();
        if (done) break;
        const d = decoder.decode(value);
        // const decoded: ScannedIp[] = JSON.parse(`[${d.replace(/}{/g, "},{")}]`);
        // setIps((prev) => [...prev, ...decoded]);
        // const decoded: { event: string; data: ScannedIp } = JSON.parse(d);
        const matches = d.match(/data:(\{.*?\})/gs);

        const extractedData: ScannedIp[] | undefined = matches?.map((match) =>
          JSON.parse(match.replace("data:", "").trim())
        );
        if (extractedData) {
          setIps((prev) => [...prev, ...extractedData]);
          setProgress((ips.length / total) * 100);
        }
      }
      reader?.cancel();
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
          missingFanCount={ips.filter((e) => e.fan_count < 4).length}
          notFoundCount={total - ips.length}
          psuFailureCount={ips.filter((e) => e.psu_failure).length}
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
