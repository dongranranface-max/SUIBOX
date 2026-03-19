'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/contexts/I18nContext";
import { AppWalletProvider } from "@/providers/WalletProvider";

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
        <I18nProvider>
          {children}
        </I18nProvider>
      </AppWalletProvider>
    </QueryClientProvider>
  );
}
