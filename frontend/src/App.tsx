import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import LoadingBar from "react-top-loading-bar";
import { ThemeProvider } from "./components/theme-provider";
import { ScannedIp } from "./lib/types";
import ScanStats from "./scanner/scan-stats";
import ScanTable from "./scanner/scan-table";

const queryClient = new QueryClient();

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
  const [banner, ] = useState({
    message: "There is a curtailment scheduled: Tuesday - 8:00pm to 9:15pm!",
    visible: true 
  });
  const ipBases = [
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
  const [scannedIps, setScannedIps] = useState<ScannedIp[]>([]);
  const [progress, setProgress] = useState(0);

  const startScan = async () => {
    const response = await fetch("http://localhost:7070/scan", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify(ipBases),
    });
    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) return;
    let isDone = false;

    while (!isDone) {
      const res = await reader.read();
      if (res.done) {
        isDone = true;
        setProgress(0);
        break;
      }
      const parsed: ScannedIp[] = res.value
        .split("\n\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x));
      setScannedIps((prev) => [...prev, ...parsed]);
      setProgress(
        (prev) => prev + (parsed.length / (ipBases.length * 255)) * 100
      );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
        {banner.visible && (
          <div className="text-center py-4 border" style={{ backgroundColor: "#0a0a0a", color: "#ffffff", borderColor: "#5D3FD3" }}>
          {banner.message}
        </div>
        )}
      <LoadingBar
        color="#e94d1b"
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="mx-10">
        <div className="pt-4 mb-5">
          <ScanStats
            totalHashrate={
              scannedIps.reduce((total, ip) => total + ip.hashrate, 0) /
              1_000_000
            }
            lessThan3Count={
              scannedIps.filter((x) => x.is_found && x.hb_count < 3).length
            }
            missingFanCount={
              scannedIps.filter((x) => x.is_found && x.fan_count < 4).length
            }
            notFoundCount={scannedIps.filter((x) => !x.is_found).length}
            onScan={startScan}
            psuFailureCount={
              scannedIps.filter((x) => x.is_found && x.psu_failure).length
            }
            scanCount={scannedIps.filter((x) => x.is_found).length}
            underhashingCount={
              scannedIps.filter((x) => x.is_found && x.is_underhashing).length
            }
          />
        </div>
        <ScanTable scannedIps={scannedIps.filter((x) => x.is_found)} />
      </div>
    </div>
  );
}
