'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletProvider as SuiWalletProvider, useWallet } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// 网络配置
const networks = {
  devnet: {
    url: 'https://fullnode.devnet.sui.io',
    wsUrl: 'wss://fullnode.devnet.sui.io',
  },
};

export function WalletProvider({ children }: { children: ReactNode }) {
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

// 导出钱包Hook
export { useWallet };
