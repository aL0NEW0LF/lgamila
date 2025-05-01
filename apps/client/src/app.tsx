import "unfonts.css";

import { BrowserRouter, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Fullscreen />}>
            <Route index element={<Home />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
