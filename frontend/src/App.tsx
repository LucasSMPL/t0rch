import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { ScannedIp } from "./lib/types";
import ScanStats from "./scanner/scan-stats";
import ScanTable from "./scanner/scan-table";
import { ModeToggle } from "./components/mode-toggle";
import { Progress } from "./components/ui/progress";

const queryClient = new QueryClient();

const ipRanges = [
  "10.0.131",
  "10.0.132",
  "10.0.133",
  "10.0.134",
  "10.0.135",
  "10.0.136",
  "10.0.137",
  "10.0.138",
  "10.0.140",
];

const totalIPs = ipRanges.length * 255;
console.log("Total IPs:", totalIPs)

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Scanner />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

function Scanner() {
  const [scannedIps, setScannedIps] = useState<ScannedIp[]>([]);
  const [scanProgress, setScanProgress] = useState<number | null>(null);

  const handleButtonClick = async () => {
    setScanProgress(0); // Reset progress bar
    const response = await fetch("http://localhost:7070/scan", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify(ipRanges),
    });
    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) return;
    let isDone = false;
    let scannedCount = 0;
    while (!isDone) {
      const res = await reader.read();
      if (res.done) {
        isDone = true;
        break;
      }
      const parsed: ScannedIp[] = res.value
        .split("\n\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x));
      setScannedIps((prev) => [...prev, ...parsed]);
      scannedCount += parsed.length;
      setScanProgress((scannedCount / totalIPs) * 100);
    }
  };

  const psuFailureCount = scannedIps.filter(ip => ip.psu_failure).length;
  const missingFanIps = scannedIps.filter(ip => ip.fan_count < 4);
  console.log("IPs with missing fans:", missingFanIps.map(ip => ip.ip));
  const missingFanCount = missingFanIps.length;
  const missingHashboardIPs = scannedIps.filter(ip => ip.hb_count < 3);
  console.log("IPs with missing hashboards:", missingHashboardIPs.map(ip => ip.ip));
  const lessThan3HB = missingHashboardIPs.length;

  const totalHashrate = scannedIps.reduce((total, ip) => total + ip.hashrate, 0);
  const totalHashratePH = totalHashrate / 1_000_000; // Convert to Petahash

  return (
    <div style={{ marginLeft: "40px", marginRight: "40px" }}>
      <div className="pt-4" style={{ marginBottom: "20px" }}>
        <ScanStats
          lessThan3Count={lessThan3HB}
          missingFanCount={missingFanCount}
          notFoundCount={0}
          onScan={handleButtonClick}
          psuFailureCount={psuFailureCount}
          scanCount={scannedIps.length}
          underhashingCount={scannedIps.filter(ip => ip.is_underhashing).length}
          totalHashrate={totalHashratePH}
        />
        <div className="pt-10 flex item-center justify-center">
          {scanProgress !== null && (
            <Progress
              indicatorColor={"bg-green-500"}
              value={scanProgress}
              className="w-[60%]"
            />
          )}
        </div>
      </div>
      <ScanTable scannedIps={scannedIps} />
      {/* <Button onClick={handleButtonClick}>Scan</Button>
      <ModeToggle /> */}
    </div>
  );
}
