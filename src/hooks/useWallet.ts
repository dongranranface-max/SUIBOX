'use client';

import { useState, useEffect, useCallback } from 'react';

interface WalletState {
  address: string | null;
  connected: boolean;
  balance: string;
  loading: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    connected: false,
    balance: '0',
    loading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem('suibox_wallet');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setState({
          address: data.address,
          connected: true,
          balance: data.balance || '1000',
          loading: false,
        });
      } catch {
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const connect = useCallback(async () => {
    const chars = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 64; i++) {
      addr += chars[Math.floor(Math.random() * 16)];
    }
    
    const walletData = {
      address: addr,
      balance: '1000',
    };
    
    localStorage.setItem('suibox_wallet', JSON.stringify(walletData));
    
    setState({
      address: addr,
      connected: true,
      balance: '1000',
      loading: false,
    });
    
    return addr;
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('suibox_wallet');
    setState({
      address: null,
      connected: false,
      balance: '0',
      loading: false,
    });
  }, []);

  const formatAddress = useCallback((addr: string) => {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    formatAddress,
  };
}
