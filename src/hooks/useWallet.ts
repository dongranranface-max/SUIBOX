'use client';

import { useState } from 'react';

const TEST_ADDRESS = '0xbfb88d37c8df43f0e826967cd635fa7b909da3d6fce691ca70e325a5fd95ed0e';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = () => {
    // 直接使用测试地址连接
    setAddress(TEST_ADDRESS);
    setConnected(true);
    localStorage.setItem('sui_address', TEST_ADDRESS);
  };

  const disconnect = () => {
    setAddress(null);
    setConnected(false);
    localStorage.removeItem('sui_address');
  };

  // 页面加载时检查localStorage
  if (typeof window !== 'undefined' && !connected) {
    const saved = localStorage.getItem('sui_address');
    if (saved) {
      setAddress(saved);
      setConnected(true);
    }
  }

  return {
    address,
    connected,
    loading: false,
    debug: connected ? `已连接: ${address?.slice(0, 10)}...` : '点击连接按钮',
    connect,
    disconnect,
    isInstalled: true,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
