import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./components/theme-provider";
import ScannerPage from "./scanner/scanner-page";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ScannerPage />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
