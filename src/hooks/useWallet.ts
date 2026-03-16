'use client';

import { useState } from 'react';
import { useWallets as useSuiWallets } from '@mysten/dapp-kit';

export function useWallet() {
  const { 
    currentAccount, 
    connect, 
    disconnect 
  } = useSuiWallets();

  return {
    address: currentAccount?.address || null,
    connected: !!currentAccount,
    loading: false,
    debug: currentAccount ? `Connected: ${currentAccount.address.slice(0, 10)}...` : 'Not connected - click button',
    connect: () => connect({ network: 'devnet' }),
    disconnect,
    isInstalled: true,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
