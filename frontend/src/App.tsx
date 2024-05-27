import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { ScannedIp } from "./lib/types";
import ScanStats from "./scanner/scan-stats";
import ScanTable from "./scanner/scan-table";

const queryClient = new QueryClient();

function App() {
  // const [count, setCount] = useState(0)
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

  const handleButtonClick = async () => {
    const response = await fetch("http://localhost:7070/scan", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify([
        "10.0.131",
        "10.0.132",
        "10.0.133",
        "10.0.134",
        "10.0.135",
        "10.0.136",
        "10.0.137",
        "10.0.138",
        "10.0.140",
      ]),
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
        break;
      }
      const parsed: ScannedIp[] = res.value
        .split("\n\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x));
      setScannedIps((prev) => [...prev, ...parsed]);
    }
  };

  return (
    <div style={{ marginLeft: "40px", marginRight: "40px" }}>
      <div className="pt-4" style={{ marginBottom: "20px" }}>
        <ScanStats
          lessThan3Count={0}
          missingFanCount={0}
          notFoundCount={0}
          onScan={() => {}}
          psuFailureCount={0}
          scanCount={0}
          underhashingCount={0}
        />
      </div>
      <ScanTable scannedIps={scannedIps} />
      <Button onClick={handleButtonClick}>Scan</Button>
    </div>
  );
}
