'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    suiWallet?: {
      address: string;
      connected: boolean;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
      signAndExecuteTransaction: (tx: any) => Promise<any>;
    };
  }
}

export interface WalletState {
  address: string | null;
  connected: boolean;
  connecting: boolean;
}

export function useSuiWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    connected: false,
    connecting: false,
  });

  // 检查钱包是否已连接
  useEffect(() => {
    const checkConnection = async () => {
      if (window.suiWallet) {
        try {
          // 尝试获取已连接的钱包
          const isConnected = window.suiWallet.connected;
          if (isConnected) {
            setWallet({
              address: window.suiWallet.address,
              connected: true,
              connecting: false,
            });
          }
        } catch (e) {
          console.log('Wallet not connected');
        }
      }
    };

    checkConnection();

    // 监听钱包变化
    const handleChange = () => {
      checkConnection();
    };
    window.addEventListener('walletchange', handleChange);
    return () => window.removeEventListener('walletchange', handleChange);
  }, []);

  // 连接钱包
  const connect = useCallback(async () => {
    if (!window.suiWallet) {
      alert('请安装 Sui Wallet 钱包插件！');
      return;
    }

    setWallet(prev => ({ ...prev, connecting: true }));
    try {
      await window.suiWallet.connect();
      setWallet({
        address: window.suiWallet?.address || null,
        connected: true,
        connecting: false,
      });
    } catch (e) {
      console.error('Failed to connect:', e);
      setWallet(prev => ({ ...prev, connecting: false }));
    }
  }, []);

  // 断开钱包
  const disconnect = useCallback(async () => {
    if (window.suiWallet) {
      await window.suiWallet.disconnect();
      setWallet({
        address: null,
        connected: false,
        connecting: false,
      });
    }
  }, []);

  // 执行交易
  const executeTransaction = useCallback(async (tx: any) => {
    if (!window.suiWallet || !wallet.connected) {
      throw new Error('Wallet not connected');
    }
    return await window.suiWallet.signAndExecuteTransaction(tx);
  }, [wallet.connected]);

  return {
    ...wallet,
    connect,
    disconnect,
    executeTransaction,
  };
}

// 检查钱包是否安装
export function isWalletInstalled(): boolean {
  return !!window.suiWallet;
}
