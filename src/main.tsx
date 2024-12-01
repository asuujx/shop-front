import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";
import "./index.css";
import { AuthProvider } from "./providers/authProvider.tsx";
import { UserProvider } from "./providers/userProvider.tsx";
import { router } from "./router/router.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </UserProvider>
  </StrictMode>
);
