'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';

// 创建网络配置
const networkConfig = createNetworkConfig({
  devnet: new SuiClient({ url: 'https://fullnode.devnet.sui.io' }),
  testnet: new SuiClient({ url: 'https://fullnode.testnet.sui.io' }),
  mainnet: new SuiClient({ url: 'https://fullnode.mainnet.sui.io' }),
});

const queryClient = new QueryClient();

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
