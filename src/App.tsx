import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FormsList } from "./features/forms/components/FormList";
import { FormDetails } from "./features/forms/routes/FormDetails";
import { PrefillOverridesProvider } from "./features/forms/context/PrefillOverridesProvider";

export default function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <PrefillOverridesProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50">
            <Routes>
              <Route path="forms" element={<FormsList />} />
              <Route path="forms/:nodeId" element={<FormDetails />} />
              <Route path="*" element={<FormsList />} />
            </Routes>
          </div>
        </BrowserRouter>
      </PrefillOverridesProvider>
    </QueryClientProvider>
  );
}
