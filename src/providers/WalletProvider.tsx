'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider as SuiWalletProvider, useWallets } from '@mysten/dapp-kit';

const queryClient = new QueryClient();

const networks = {
  devnet: { url: 'https://fullnode.devnet.sui.io' },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiWalletProvider networks={networks} defaultNetwork="devnet">
        {children}
      </SuiWalletProvider>
    </QueryClientProvider>
  );
}

export { useWallets as useWallet };
