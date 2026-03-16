'use client';

import { ReactNode } from 'react';
import { DAppKitProvider } from '@mysten/dapp-kit-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// SUI 网络配置
const networks = {
  devnet: { url: 'https://fullnode.devnet.sui.io' },
  testnet: { url: 'https://fullnode.testnet.sui.io' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io' },
};

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider
        networks={networks}
        defaultNetwork="devnet"
      >
        {children}
      </DAppKitProvider>
    </QueryClientProvider>
  );
}

// 导出常用 Hook
export { useCurrentAccount, useCurrentWallet, useCurrentClient } from '@mysten/dapp-kit-react';
