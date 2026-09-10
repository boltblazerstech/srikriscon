"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/src/hooks/useCart";
import { AuthProvider } from "@/src/context/AuthContext";
import { theme } from "@/src/config/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60_000, // 5 minutes stale time to avoid repeat fetching on page transitions
            gcTime: 30 * 60_000,    // 30 minutes garbage collection / cache lifetime
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "8px",
                background: "#1f2937",
                color: "#f9fafb",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: theme.colors.success,     secondary: "#fff" } },
              error:   { iconTheme: { primary: theme.colors.destructive, secondary: "#fff" } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
