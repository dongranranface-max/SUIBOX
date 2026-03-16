'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

// 硬编码 RPC URL
const networks = {
  devnet: { url: 'https://fullnode.devnet.sui.io' },
  testnet: { url: 'https://fullnode.testnet.sui.io' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io' },
};

const queryClient = new QueryClient();

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
