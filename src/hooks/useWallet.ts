'use client';

import { useWallet as useSuietWallet } from '@suiet/wallet-kit';

export function useWallet() {
  const wallet = useSuietWallet();

  return {
    address: wallet.account?.address || null,
    connected: wallet.connected,
    loading: wallet.connecting,
    connect: () => {}, // ConnectButton handles connection
    disconnect: () => {}, 
    isInstalled: true,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
