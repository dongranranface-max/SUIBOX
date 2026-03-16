'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit';

// 创建QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

// 网络配置
const networks = {
  devnet: {
    url: 'https://fullnode.devnet.sui.io',
  },
};

// Providers包装组件
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiWalletProvider
        networks={networks}
        defaultNetwork="devnet"
      >
        {children}
      </SuiWalletProvider>
    </QueryClientProvider>
  );
}

// 导出useWallet
export { useWallet } from '@mysten/dapp-kit';
