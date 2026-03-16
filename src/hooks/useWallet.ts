'use client';

import { useCurrentAccount, useWallets } from '@mysten/dapp-kit-react';

export function useWallet() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  
  const address = account?.address || null;
  const connected = !!address;
  const isInstalled = wallets.length > 0;

  return {
    address,
    connected,
    loading: false,
    debug: connected 
      ? `已连接: ${address?.slice(0, 10)}...` 
      : isInstalled 
        ? '请连接钱包' 
        : '未检测到钱包',
    connect: () => {}, // 由 ConnectButton 处理
    disconnect: () => {},
    isInstalled,
    wallets,
  };
}

export function shortenAddress(addr: string | null | undefined): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
