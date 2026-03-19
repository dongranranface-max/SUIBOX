'use client';

import { ReactNode } from 'react';
import { SuiClientProvider } from '@mysten/dapp-kit';
import { WalletProvider as SuietWalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

const networks = {
  mainnet: 'https://fullnode.mainnet.sui.io',
  testnet: 'https://fullnode.testnet.sui.io', 
  devnet: 'https://fullnode.devnet.sui.io',
};

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <SuiClientProvider networks={networks} defaultNetwork="devnet">
      <SuietWalletProvider>
        {children}
      </SuietWalletProvider>
    </SuiClientProvider>
  );
}
