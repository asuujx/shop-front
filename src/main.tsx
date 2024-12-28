import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./assets/index.css";
import { Toaster } from "./modules/core/components/ui/toaster.tsx";
import { AuthProvider } from "./modules/core/providers/authProvider.tsx";
import { StripeProvider } from "./modules/core/providers/stripeProvider.tsx";
import { ThemeProvider } from "./modules/core/providers/themeProvider.tsx";
import { UserProvider } from "./modules/core/providers/userProvider.tsx";
import { router } from "./router/router.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <QueryClientProvider client={queryClient}>
            <StripeProvider>
              <RouterProvider router={router} />
            </StripeProvider>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </UserProvider>
  </StrictMode>
);
