'use client';

import { useWallet as useSuiWallet } from '@/providers/WalletProvider';

export function useWallet() {
  const { 
    currentAccount, 
    connect, 
    disconnect,
    isConnected,
    wallets 
  } = useSuiWallet();

  return {
    address: currentAccount?.address || null,
    connected: !!currentAccount,
    loading: false,
    debug: currentAccount ? `Connected: ${currentAccount.address.slice(0, 10)}...` : 'Not connected',
    connect: () => connect({ network: 'devnet' }),
    disconnect,
    isInstalled: (wallets?.length || 0) > 0,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
