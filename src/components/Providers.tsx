'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppWalletProvider } from "@/providers/WalletProvider";
import { SuiDataProvider } from "@/contexts/SuiDataProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AppWalletProvider>
        <SuiDataProvider>
          {children}
        </SuiDataProvider>
      </AppWalletProvider>
    </QueryClientProvider>
  );
}
