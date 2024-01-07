/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssVarsProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./core/store";
import { theme } from "./core/theme";
import { Router } from "./routes/index";

const container = document.getElementById("root");
const root = createRoot(container!);
const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <SnackbarProvider>
        <StoreProvider>
          <QueryClientProvider client={queryClient}>
            <Router />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </StoreProvider>
      </SnackbarProvider>
    </CssVarsProvider>
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
