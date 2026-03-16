'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  WalletProvider as SuiWalletProvider,
  useWallets,
  useCurrentAccount,
  useCurrentWallet,
  ConnectButton,
  useSuiClient,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

// SUI 网络配置
const networks = {
  devnet: { url: 'https://fullnode.devnet.sui.io' },
  testnet: { url: 'https://fullnode.testnet.sui.io' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io' },
};

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

// 导出常用 Hook
export { 
  useWallets, 
  useCurrentAccount, 
  useCurrentWallet, 
  ConnectButton,
  useSuiClient,
  useSignAndExecuteTransactionBlock,
};
