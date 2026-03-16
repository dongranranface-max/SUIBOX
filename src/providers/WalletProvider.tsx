'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider as SuiWalletProvider, useWallet } from '@mysten/dapp-kit';

const queryClient = new QueryClient();

const networks = {
  devnet: { url: 'https://fullnode.devnet.sui.io' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io' },
};

function WalletInit({ children }: { children: ReactNode }) {
  const { currentAccount, connect, disconnect } = useWallet();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // 强制刷新当账户变化时
    const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiWalletProvider
        networks={networks}
        defaultNetwork="devnet"
      >
        <WalletInit>{children}</WalletInit>
      </SuiWalletProvider>
    </QueryClientProvider>
  );
}

// 重新导出useWallet
export { useWallet };
