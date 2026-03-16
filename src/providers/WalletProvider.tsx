'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  WalletProvider,
  getFullnodeUrl,
  SuiDevnet,
  SuiTestnet,
  SuiMainnet,
} from '@mysten/dapp-kit';

const queryClient = new QueryClient();

const networks = [
  { ...SuiDevnet, url: getFullnodeUrl('devnet') },
  { ...SuiTestnet, url: getFullnodeUrl('testnet') },
  { ...SuiMainnet, url: getFullnodeUrl('mainnet') },
];

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider networks={networks} defaultNetwork="devnet">
        {children}
      </WalletProvider>
    </QueryClientProvider>
  );
}
