"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/src/hooks/useCart";
import { theme } from "@/src/config/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
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
            success: { iconTheme: { primary: theme.colors.success, secondary: "#fff" } },
            error:   { iconTheme: { primary: theme.colors.destructive, secondary: "#fff" } },
          }}
        />
      </CartProvider>
    </QueryClientProvider>
  );
}
