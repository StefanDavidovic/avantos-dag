import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FormsList } from "./features/forms/components/FormList";
import { FormDetails } from "./features/forms/routes/FormDetails";

export default function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <div className="max-w-3xl mx-auto py-10">
          <Routes>
            <Route path="forms" element={<FormsList />} />
            <Route path="forms/:nodeId" element={<FormDetails />} />
            <Route path="*" element={<FormsList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
