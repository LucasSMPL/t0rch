import axios from "axios";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { ThemeProvider } from "./components/theme-provider";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function scanIps(): Promise<any> {
  const res = await axios.post("http://localhost:7070/scan", [
    "10.0.131",
    "10.0.132",
    "10.0.133",
    "10.0.134",
    "10.0.135",
    "10.0.136",
    "10.0.137",
    "10.0.138",
    "10.0.140",
  ]);
  return res.data;
}

function Scanner() {
  const mutation = useMutation(scanIps, {
    onSuccess: (res) => {
      console.log(res);
    },
  });

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
      <ScanTable scannedIps={[]}/>
      <Button onClick={() => { mutation.mutate(); }} style={{ backgroundColor: "#"}}>Start Real Scan</Button>
    </div>
  );
}
