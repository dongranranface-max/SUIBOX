'use client';

import { ReactNode } from 'react';
import { WalletProvider, Chain } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

// SUI网络配置
const SUI_CHAINS: Chain[] = [
  {
    id: 'sui:devnet',
    name: 'SUI Devnet',
    rpcUrl: 'https://fullnode.devnet.sui.io',
  },
  {
    id: 'sui:testnet',
    name: 'SUI Testnet',
    rpcUrl: 'https://fullnode.testnet.sui.io',
  },
  {
    id: 'sui:mainnet',
    name: 'SUI Mainnet',
    rpcUrl: 'https://fullnode.mainnet.sui.io',
  },
];

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletProvider
      chains={SUI_CHAINS}
      defaultChain="sui:devnet"
    >
      {children}
    </WalletProvider>
  );
}
