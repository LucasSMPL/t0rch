import axios from "axios";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

function App() {
  // const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <Scanner />
    </QueryClientProvider>
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
    <div className="flex justify-center w-full h-full">
      <Button
        onClick={() => {
          mutation.mutate();
        }}
      >
        Scan 2
      </Button>
    </div>
  );
}
