'use client';

import { useState, useEffect } from 'react';

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
  });

  useEffect(() => {
    // 尝试获取 window.sui (Wallet Standard)
    const checkWallet = () => {
      if (typeof window === 'undefined') return;

      // 方法1: window.sui (Wallet Standard)
      const suiWindow = (window as unknown as { sui?: { wallets?: { accounts?: { address: string }[] }[] } }).sui;
      if (suiWindow?.wallets?.[0]?.accounts?.[0]?.address) {
        setWallet({
          address: suiWindow.wallets[0].accounts[0].address,
          connected: true,
          loading: false,
        });
        return;
      }

      // 方法2: 尝试直接调用 Sui Wallet
      const suiWallet = (window as unknown as { suiWallet?: { address?: string; connect?: () => Promise<void> } }).suiWallet;
      if (suiWallet?.address) {
        setWallet({
          address: suiWallet.address,
          connected: true,
          loading: false,
        });
        return;
      }

      setWallet(prev => ({ ...prev, loading: false }));
    };

    checkWallet();
    const timer = setInterval(checkWallet, 2000);
    return () => clearInterval(timer);
  }, []);

  const connect = async () => {
    // 尝试触发钱包连接
    const suiWindow = (window as unknown as { sui?: { wallets?: { connect?: () => Promise<void> }[] } }).sui;
    if (suiWindow?.wallets?.[0]) {
      await suiWindow.wallets[0].connect?.();
    }
  };

  const disconnect = () => {
    setWallet({ address: null, connected: false, loading: false });
  };

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: true,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
