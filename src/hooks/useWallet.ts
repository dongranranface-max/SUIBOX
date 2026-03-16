'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    suiet?: {
      address: string;
      connected: boolean;
    };
    // 官方Sui Wallet
    sui?: {
      hasWallets: boolean;
    };
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWallet = () => {
      if (typeof window === 'undefined') return;

      // 检查Suiet Wallet
      if (window.suiet?.connected && window.suiet?.address) {
        setAddress(window.suiet.address);
        setConnected(true);
        setLoading(false);
        return;
      }

      // 检查官方Sui Wallet
      // 官方钱包会通过content script注入
      if (window.sui?.hasWallets) {
        // 钱包已注入，等待用户连接
      }

      setAddress(null);
      setConnected(false);
      setLoading(false);
    };

    checkWallet();
    const timer = setInterval(checkWallet, 1000);
    return () => clearInterval(timer);
  }, []);

  const connect = async () => {
    setLoading(true);
    
    try {
      // 尝试连接Suiet
      if (window.suiet) {
        // Suiet会自动弹出连接窗口
        // 需要刷新状态
        setTimeout(() => {
          if (window.suiet?.connected) {
            setAddress(window.suiet.address);
            setConnected(true);
          }
          setLoading(false);
        }, 1000);
        return;
      }

      // 如果没有钱包
      alert('请先安装Sui钱包插件！\n推荐安装：Suiet Wallet\nhttps://chrome.google.com/webstore/detail/suiet-wallet/kmhcihpebhijhfhdcnmfhlnnpbmnjgeb');
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const disconnect = async () => {
    setAddress(null);
    setConnected(false);
  };

  return {
    address,
    connected,
    loading,
    connect,
    disconnect,
    isInstalled: typeof window !== 'undefined' && (!!window.suiet || !!window.sui),
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
