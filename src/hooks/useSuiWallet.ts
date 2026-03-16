'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    suiWallet?: {
      address: string;
      connected: boolean;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
      signAndExecuteTransaction: (tx: { data: any }) => Promise<{ digest: string; effects: any }>;
      getOwnedObjects?: (params: any) => Promise<any>;
    };
  }
}

export interface WalletState {
  address: string | null;
  connected: boolean;
  loading: boolean;
}

// 检查钱包是否安装
export function isWalletInstalled(): boolean {
  return typeof window !== 'undefined' && !!window.suiWallet;
}

// SUI钱包Hook
export function useSuiWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    connected: false,
    loading: true,
  });

  // 检查钱包连接状态
  const checkConnection = useCallback(async () => {
    if (typeof window === 'undefined') {
      setWallet({ address: null, connected: false, loading: false });
      return;
    }

    const suiWallet = window.suiWallet;
    if (!suiWallet) {
      setWallet({ address: null, connected: false, loading: false });
      return;
    }

    try {
      // 尝试获取已连接状态
      if (suiWallet.connected && suiWallet.address) {
        setWallet({
          address: suiWallet.address,
          connected: true,
          loading: false,
        });
      } else {
        setWallet({ address: null, connected: false, loading: false });
      }
    } catch (e) {
      console.error('Wallet check error:', e);
      setWallet({ address: null, connected: false, loading: false });
    }
  }, []);

  useEffect(() => {
    checkConnection();

    // 监听钱包变化
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  // 连接钱包
  const connect = useCallback(async () => {
    const suiWallet = window.suiWallet;
    if (!suiWallet) {
      throw new Error('请安装 Sui Wallet 钱包插件！');
    }

    setWallet(prev => ({ ...prev, loading: true }));
    
    try {
      await suiWallet.connect();
      if (suiWallet.address) {
        setWallet({
          address: suiWallet.address,
          connected: true,
          loading: false,
        });
      }
    } catch (e) {
      console.error('Connect error:', e);
      setWallet(prev => ({ ...prev, loading: false }));
      throw e;
    }
  }, []);

  // 断开钱包
  const disconnect = useCallback(async () => {
    const suiWallet = window.suiWallet;
    if (suiWallet) {
      await suiWallet.disconnect();
    }
    setWallet({ address: null, connected: false, loading: false });
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: isWalletInstalled(),
  };
}

// 短地址
export function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
