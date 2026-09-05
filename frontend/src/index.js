import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import "@/styles/storyCueLayerV1.css";
// AppV18 is the ONLY application entry. AppV16/V15/V11 remain untouched references;
// exact Candidate 2 rollback means redeploying its complete frozen commit, because V16
// also corrects the shared house policy and Services consumer.
// removed on 2026-08-24 (launch audit item 1) so no future change can land on a
// file the bundle does not use. If you fork the app, update this import AND the
// feature contract tests in src/__contract__/.
import App from "@/AppV18";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
