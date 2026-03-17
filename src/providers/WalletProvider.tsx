'use client';

import { ReactNode } from 'react';
import { WalletProvider, createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';

// 使用硬编码 URL
const networkConfig = createNetworkConfig({
  devnet: { url: 'https://fullnode.devnet.sui.io' },
  testnet: { url: 'https://fullnode.testnet.sui.io' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io' },
});

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
      <WalletProvider>
        {children}
      </WalletProvider>
    </SuiClientProvider>
  );
}
