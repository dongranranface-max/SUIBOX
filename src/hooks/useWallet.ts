'use client';

import { useState, useEffect, useCallback } from 'react';

// Sui Wallet Standard
interface WalletAccount {
  address: string;
  chain?: string;
}

interface Wallet {
  name: string;
  icon?: string;
  accounts: WalletAccount[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    sui?: {
      wallets: Wallet[];
    };
    suiWallet?: {
      isConnected: () => Promise<boolean>;
      getAccounts: () => Promise<string[]>;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
    };
    // Suiet Wallet
    suiet?: {
      address: string;
      connected: boolean;
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
  });

  // 多种方式检测钱包
  const detectWallet = useCallback(async () => {
    if (typeof window === 'undefined') {
      setWallet({ address: null, connected: false, loading: false });
      return;
    }

    try {
      // 方式1: Wallet Standard (window.sui)
      if (window.sui?.wallets?.length) {
        const suiWallet = window.sui.wallets.find((w: Wallet) => 
          w.name?.toLowerCase().includes('sui')
        );
        if (suiWallet?.accounts?.[0]?.address) {
          setWallet({
            address: suiWallet.accounts[0].address,
            connected: true,
            loading: false,
          });
          return;
        }
      }

      // 方式2: 旧版Sui Wallet (window.suiWallet)
      if (window.suiWallet) {
        const isConnected = await window.suiWallet.isConnected?.();
        if (isConnected) {
          const accounts = await window.suiWallet.getAccounts?.();
          if (accounts?.[0]) {
            setWallet({
              address: accounts[0],
              connected: true,
              loading: false,
            });
            return;
          }
        }
      }

      // 方式3: Suiet Wallet
      if (window.suiet?.connected && window.suiet?.address) {
        setWallet({
          address: window.suiet.address,
          connected: true,
          loading: false,
        });
        return;
      }
    } catch (e) {
      console.error('Wallet detection error:', e);
    }

    setWallet({ address: null, connected: false, loading: false });
  }, []);

  useEffect(() => {
    detectWallet();
    
    // 监听钱包变化
    const handleChange = () => detectWallet();
    window.addEventListener('wallet:change', handleChange);
    window.addEventListener('storage', handleChange);
    
    const interval = setInterval(detectWallet, 2000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('wallet:change', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, [detectWallet]);

  const connect = async () => {
    setWallet(prev => ({ ...prev, loading: true }));
    
    try {
      // 方式1: Wallet Standard
      if (window.sui?.wallets?.length) {
        const suiWallet = window.sui.wallets.find((w: Wallet) => 
          w.name?.toLowerCase().includes('sui')
        );
        if (suiWallet) {
          await suiWallet.connect();
          if (suiWallet.accounts?.[0]?.address) {
            setWallet({ 
              address: suiWallet.accounts[0].address, 
              connected: true, 
              loading: false 
            });
            return;
          }
        }
      }

      // 方式2: 旧版Sui Wallet
      if (window.suiWallet) {
        await window.suiWallet.connect();
        const accounts = await window.suiWallet.getAccounts?.();
        if (accounts?.[0]) {
          setWallet({ 
            address: accounts[0], 
            connected: true, 
            loading: false 
          });
          return;
        }
      }

      alert('未检测到Sui Wallet，请确保已安装并解锁钱包！');
    } catch (e) {
      console.error('Connect error:', e);
      alert('连接失败，请重试！');
    }
    
    setWallet(prev => ({ ...prev, loading: false }));
  };

  const disconnect = async () => {
    try {
      if (window.sui?.wallets?.length) {
        const suiWallet = window.sui.wallets.find((w: Wallet) => 
          w.name?.toLowerCase().includes('sui')
        );
        await suiWallet?.disconnect();
      }
      if (window.suiWallet) {
        await window.suiWallet.disconnect();
      }
    } catch (e) {
      console.error('Disconnect error:', e);
    }
    setWallet({ address: null, connected: false, loading: false });
  };

  // 检测是否有任何钱包安装
  const isInstalled = typeof window !== 'undefined' && (
    !!window.sui?.wallets?.length ||
    !!window.suiWallet ||
    !!window.suiet
  );

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled,
  };
}

export function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
