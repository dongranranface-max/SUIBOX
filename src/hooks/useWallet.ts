'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    suiWallet?: {
      address: string;
      connected: boolean;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
  });

  useEffect(() => {
    const checkWallet = () => {
      if (typeof window === 'undefined') {
        setWallet({ address: null, connected: false, loading: false });
        return;
      }
      
      const suiWallet = window.suiWallet;
      if (suiWallet?.connected && suiWallet?.address) {
        setWallet({
          address: suiWallet.address,
          connected: true,
          loading: false,
        });
      } else {
        setWallet({ address: null, connected: false, loading: false });
      }
    };

    checkWallet();
    const interval = setInterval(checkWallet, 2000);
    return () => clearInterval(interval);
  }, []);

  const connect = async () => {
    const suiWallet = window.suiWallet;
    if (!suiWallet) {
      alert('请安装Sui Wallet钱包插件！');
      return;
    }
    setWallet(prev => ({ ...prev, loading: true }));
    try {
      await suiWallet.connect();
      if (suiWallet.address) {
        setWallet({ address: suiWallet.address, connected: true, loading: false });
      }
    } catch (e) {
      console.error(e);
      setWallet(prev => ({ ...prev, loading: false }));
    }
  };

  const disconnect = async () => {
    const suiWallet = window.suiWallet;
    if (suiWallet) {
      await suiWallet.disconnect();
    }
    setWallet({ address: null, connected: false, loading: false });
  };

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: typeof window !== 'undefined' && !!window.suiWallet,
  };
}

export function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
