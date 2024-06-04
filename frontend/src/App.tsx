import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import ScannerPage from "./scanner/scanner-page";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ScannerPage />
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
