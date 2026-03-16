'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';

export function useWallet() {
  const account = useCurrentAccount();
  
  const address = account?.address || null;
  const connected = !!address;

  return {
    address,
    connected,
    loading: false,
    debug: connected ? `已连接: ${address?.slice(0, 10)}...` : '点击连接按钮',
    // connect 和 disconnect 由 ConnectButton 组件处理
    connect: () => {},
    disconnect: () => {},
    isInstalled: true,
  };
}

export function shortenAddress(addr: string | null | undefined): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
