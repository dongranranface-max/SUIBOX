'use client';

import { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

// 钱包上下文
interface WalletContextType {
  address: string | null;
  connected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connected: false,
});

export function useWallet() {
  return useContext(WalletContext);
}

// Providers包装组件
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletContext.Provider value={{ address: null, connected: false }}>
        {children}
      </WalletContext.Provider>
    </QueryClientProvider>
  );
}
